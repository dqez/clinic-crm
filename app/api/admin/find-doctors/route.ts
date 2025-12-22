/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // 1. Parse Input
  const { service_id, booking_time } = await request.json()

  if (!service_id || !booking_time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const bookingDate = new Date(booking_time)

  // Use local time components to ensure dateStr and timeStr are consistent with each other
  // and match the server's local timezone (which should match the DB schedules if running locally/regionally)
  const year = bookingDate.getFullYear()
  const month = String(bookingDate.getMonth() + 1).padStart(2, '0')
  const day = String(bookingDate.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`

  const hours = String(bookingDate.getHours()).padStart(2, '0')
  const minutes = String(bookingDate.getMinutes()).padStart(2, '0')
  const seconds = String(bookingDate.getSeconds()).padStart(2, '0')
  const timeStr = `${hours}:${minutes}:${seconds}`

  try {
    // 2. Parallel Fetching: Doctors & Schedules
    // We fetch doctors for the service AND all available schedules for that date simultaneously
    const [
      { data: doctorsData, error: doctorsError },
      { data: dailySchedules, error: scheduleError }
    ] = await Promise.all([
      // Query A: Doctors capable of this service
      supabase
        .from('doctors')
        .select(`
          id,
          specialty,
          degree,
          user:users (name, is_active),
          doctor_services!inner(service_id)
        `)
        .eq('doctor_services.service_id', service_id),

      // Query B: All schedules for this date
      supabase
        .from('doctor_schedules')
        .select('*')
        .eq('date', dateStr)
        .eq('is_available', true)
    ])

    if (doctorsError) throw doctorsError
    if (scheduleError) throw scheduleError

    if (!doctorsData || doctorsData.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // Filter available doctors
    const availableDoctors = doctorsData.filter(doc => {
      // Is user active?
      if (doc.user?.is_active === false) return false;

      // Has schedule covering this time?
      const schedule = dailySchedules?.find(s => s.doctor_id === doc.id &&
        s.start_time <= timeStr && s.end_time > timeStr
      )

      return !!schedule
    }).map(doc => ({
      id: doc.id,
      name: doc.user?.name,
      specialty: doc.specialty,
      degree: doc.degree
    }))

    return NextResponse.json({ data: availableDoctors })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
