import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. Check if current user is admin/staff
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Optional: Check role in public.users
    const { data: currentUserProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentUserProfile?.role !== 'admin' && currentUserProfile?.role !== 'staff') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Parse input
    const body = await request.json()
    const {
      email,
      password,
      name,
      phone,
      specialty,
      clinic_id,
      degree,
      price_per_slot,
      bio
    } = body

    if (!email || !password || !name || !specialty || !clinic_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    // 3. Create Auth User
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'doctor',
        name: name
      }
    })

    if (authError) {
      console.error('Auth create error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authUser.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // 4. Insert into public.users
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        email: email,
        name: name,
        phone: phone || '',
        role: 'doctor',
        is_active: true,
        password: 'managed_by_supabase_auth' // Placeholder as auth is handled by Supabase Auth
      })

    if (userError) {
      console.error('Public user insert error:', userError)
      // Cleanup auth user if possible? Or just return error
      return NextResponse.json({ error: 'Failed to create public user profile' }, { status: 500 })
    }

    // 5. Insert into public.doctors
    const { error: doctorError } = await supabaseAdmin
      .from('doctors')
      .insert({
        user_id: authUser.user.id,
        specialty,
        clinic_id,
        degree,
        price_per_slot: Number(price_per_slot) || 0,
        bio,
        is_available: true
      })

    if (doctorError) {
      console.error('Doctor profile insert error:', doctorError)
      return NextResponse.json({ error: 'Failed to create doctor profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: authUser.user.id })

  } catch (error: any) {
    console.error('Create doctor error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
