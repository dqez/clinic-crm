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
      bio,
      service_ids = [],  // NEW: Array of service UUIDs
      schedules = []     // NEW: Array of schedule objects
    } = body

    if (!email || !password || !name || !specialty || !clinic_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate new fields
    if (!Array.isArray(service_ids) || service_ids.length === 0) {
      return NextResponse.json({ error: 'At least one service must be selected' }, { status: 400 })
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

    const userId = authUser.user.id

    // 4. Insert into public.users
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: email,
        name: name,
        phone: phone || '',
        role: 'doctor',
        is_active: true,
        password: 'managed_by_supabase_auth'
      })

    if (userError) {
      console.error('Public user insert error:', userError)
      console.error('Error details:', JSON.stringify(userError, null, 2))
      // Cleanup auth user
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json({
        error: 'Failed to create public user profile',
        details: userError.message || userError.hint || 'Unknown error'
      }, { status: 500 })
    }

    // 5. Insert into public.doctors
    const { data: doctorData, error: doctorError } = await supabaseAdmin
      .from('doctors')
      .insert({
        user_id: userId,
        specialty,
        clinic_id,
        degree,
        price_per_slot: Number(price_per_slot) || 0,
        bio,
        is_available: true
      })
      .select()
      .single()

    if (doctorError || !doctorData) {
      console.error('Doctor profile insert error:', doctorError)
      // Cleanup
      await supabaseAdmin.from('users').delete().eq('id', userId)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: 'Failed to create doctor profile' }, { status: 500 })
    }

    const doctorId = doctorData.id

    // 6. Insert into doctor_services (Link doctor with services)
    const serviceLinks = service_ids.map((serviceId: string) => ({
      doctor_id: doctorId,
      service_id: serviceId
    }))

    const { error: servicesError } = await supabaseAdmin
      .from('doctor_services')
      .insert(serviceLinks)

    if (servicesError) {
      console.error('Doctor services insert error:', servicesError)
      // Cleanup
      await supabaseAdmin.from('doctors').delete().eq('id', doctorId)
      await supabaseAdmin.from('users').delete().eq('id', userId)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: 'Failed to link doctor with services' }, { status: 500 })
    }

    // 7. Insert into doctor_schedules (if provided)
    if (schedules && schedules.length > 0) {
      const scheduleRecords: Array<{
        doctor_id: string
        date: string
        start_time: string
        end_time: string
        max_patients: number
        is_available: boolean
      }> = []

      for (const schedule of schedules) {
        if (!schedule.date || !schedule.shifts || !Array.isArray(schedule.shifts)) {
          continue // Skip invalid entries
        }

        for (const shift of schedule.shifts) {
          if (!shift.start_time || !shift.end_time) {
            continue // Skip invalid shifts
          }

          scheduleRecords.push({
            doctor_id: doctorId,
            date: schedule.date,
            start_time: shift.start_time,
            end_time: shift.end_time,
            max_patients: shift.max_patients || 10,
            is_available: true
          })
        }
      }

      if (scheduleRecords.length > 0) {
        const { error: schedulesError } = await supabaseAdmin
          .from('doctor_schedules')
          .insert(scheduleRecords)

        if (schedulesError) {
          console.error('Doctor schedules insert error:', schedulesError)
          // Note: Not failing the entire operation if schedules fail
          // Admin can add schedules later
          console.warn('Doctor created but schedules failed. Manual schedule setup required.')
        }
      }
    }

    return NextResponse.json({
      success: true,
      userId,
      doctorId,
      message: 'Doctor created successfully'
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Create doctor error:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
