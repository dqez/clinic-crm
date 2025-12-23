import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing start or end date' },
        { status: 400 }
      )
    }

    // Fetch all active doctors with their user info
    const { data: doctors, error: doctorsError } = await supabase
      .from('doctors')
      .select(`
        id,
        user_id,
        is_available,
        users (
          name
        )
      `)
      .eq('is_available', true)

    if (doctorsError) {
      return NextResponse.json(
        { error: doctorsError.message },
        { status: 500 }
      )
    }

    // Fetch schedules for the date range
    const { data: schedules, error: schedulesError } = await supabase
      .from('doctor_schedules')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('is_available', true)

    if (schedulesError) {
      return NextResponse.json(
        { error: schedulesError.message },
        { status: 500 }
      )
    }

    // Fetch bookings for the date range to count bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('doctor_id, booking_time, status')
      .gte('booking_time', `${startDate}T00:00:00`)
      .lte('booking_time', `${endDate}T23:59:59`)
      .in('status', ['scheduled', 'confirmed', 'pending'])

    if (bookingsError) {
      return NextResponse.json(
        { error: bookingsError.message },
        { status: 500 }
      )
    }

    // Build the schedule grid
    const doctorSchedules = doctors?.map(doctor => {
      // Get doctor name from users table
      const doctorName = (doctor.users as { name: string } | null)?.name || 'Unknown Doctor'

      // Get all schedules for this doctor
      const doctorShifts = schedules?.filter(s => s.doctor_id === doctor.id) || []

      const shifts = doctorShifts.map(schedule => {
        // Count bookings for this shift
        const shiftDate = schedule.date
        const shiftStart = schedule.start_time
        const shiftEnd = schedule.end_time

        const bookedCount = bookings?.filter(booking => {
          if (booking.doctor_id !== doctor.id) return false

          const bookingDateTime = new Date(booking.booking_time)
          const bookingDate = bookingDateTime.toISOString().split('T')[0]
          const bookingTime = bookingDateTime.toTimeString().slice(0, 8)

          return bookingDate === shiftDate &&
            bookingTime >= shiftStart &&
            bookingTime < shiftEnd
        }).length || 0

        // Determine status
        let status: 'available' | 'busy' | 'full' = 'available'
        const maxPatients = schedule.max_patients || 0
        const occupancyRate = maxPatients > 0 ? bookedCount / maxPatients : 0

        if (bookedCount >= maxPatients && maxPatients > 0) {
          status = 'full'
        } else if (occupancyRate >= 0.5) {
          status = 'busy'
        }

        return {
          date: schedule.date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          max_patients: maxPatients,
          booked_count: bookedCount,
          status
        }
      })

      return {
        doctor_id: doctor.id,
        doctor_name: doctorName,
        shifts
      }
    })

    return NextResponse.json({
      schedules: doctorSchedules,
      start_date: startDate,
      end_date: endDate
    })

  } catch (error) {
    console.error('Error fetching doctor schedules:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
