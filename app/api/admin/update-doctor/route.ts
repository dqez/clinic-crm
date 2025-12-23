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

    // Check role in public.users
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
      doctor_id,
      specialty,
      degree,
      price_per_slot,
      bio,
      service_ids = [],
      schedules = [],
      start_date,
      end_date
    } = body

    if (!doctor_id) {
      return NextResponse.json({ error: 'Missing doctor_id' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    // 3. Update doctors table
    const { error: doctorError } = await supabaseAdmin
      .from('doctors')
      .update({
        specialty,
        degree,
        price_per_slot: Number(price_per_slot) || 0,
        bio
      })
      .eq('id', doctor_id)

    if (doctorError) {
      console.error('Doctor update error:', doctorError)
      return NextResponse.json({
        error: 'Failed to update doctor profile',
        details: doctorError.message
      }, { status: 400 })
    }

    // 4. Update doctor_services if provided
    if (service_ids && service_ids.length >= 0) {
      // Delete existing service links
      await supabaseAdmin
        .from('doctor_services')
        .delete()
        .eq('doctor_id', doctor_id)

      // Insert new service links
      if (service_ids.length > 0) {
        const serviceLinks = service_ids.map((serviceId: string) => ({
          doctor_id: doctor_id,
          service_id: serviceId
        }))

        const { error: servicesError } = await supabaseAdmin
          .from('doctor_services')
          .insert(serviceLinks)

        if (servicesError) {
          console.error('Doctor services update error:', servicesError)
          return NextResponse.json({
            error: 'Failed to update doctor services',
            details: servicesError.message
          }, { status: 400 })
        }
      }
    }

    // 5. Update schedules if provided
    if (schedules && schedules.length > 0 && start_date && end_date) {
      // Delete existing schedules in the date range
      await supabaseAdmin
        .from('doctor_schedules')
        .delete()
        .eq('doctor_id', doctor_id)
        .gte('date', start_date)
        .lte('date', end_date)

      // Insert new schedules
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
          continue
        }

        for (const shift of schedule.shifts) {
          if (!shift.start_time || !shift.end_time) {
            continue
          }

          scheduleRecords.push({
            doctor_id: doctor_id,
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
          console.error('Doctor schedules update error:', schedulesError)
          // Don't fail the entire operation if schedules fail
          console.warn('Doctor updated but schedules failed.')
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor updated successfully'
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Update doctor error:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
