/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { formatInTimeZone } from 'date-fns-tz'
import { addMinutes } from 'date-fns'

// Helper: Chuyển đổi giờ (HH:mm hoặc HH:mm:ss) thành số phút để so sánh an toàn
function timeToMinutes(timeStr: string | null | undefined): number {
  if (!timeStr) return -1;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export async function POST(request: Request) {
  const supabase = await createClient()

  // 1. Parse Input
  const { service_id, booking_time } = await request.json()

  // LOGGING: Check input gốc từ client
  console.log('--- FIND DOCTORS REQUEST ---');
  console.log('Input booking_time:', booking_time);
  console.log('Input service_id:', service_id);

  if (!service_id || !booking_time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // --- FIX TIMEZONE với date-fns-tz ---
  const TIME_ZONE = 'Asia/Ho_Chi_Minh';

  // Tạo date object từ input
  const reqDate = new Date(booking_time);

  // Format ngày và giờ theo múi giờ VN
  const localDateStr = formatInTimeZone(reqDate, TIME_ZONE, 'yyyy-MM-dd'); // YYYY-MM-DD
  const localTimeStr = formatInTimeZone(reqDate, TIME_ZONE, 'HH:mm:ss'); // HH:mm:ss

  // LOGGING: Check thời gian đã quy đổi
  console.log('Converted Date (VN):', localDateStr);
  console.log('Converted Time (VN):', localTimeStr);

  try {
    // 2. Get Service Info (Duration)
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('duration_minutes')
      .eq('id', service_id)
      .single()

    if (serviceError) throw serviceError

    const duration = serviceData?.duration_minutes || 30

    // Tính thời gian kết thúc của slot khách ĐANG MUỐN đặt
    const reqEndTime = addMinutes(reqDate, duration);
    const reqEndTimeStr = formatInTimeZone(reqEndTime, TIME_ZONE, 'HH:mm:ss');

    console.log('Request Duration:', duration);
    console.log('Request EndTime (VN):', reqEndTimeStr);

    // Chuẩn bị số phút để so sánh (Logic quan trọng)
    const reqStartMinutes = timeToMinutes(localTimeStr);
    const reqEndMinutes = timeToMinutes(reqEndTimeStr);

    // 3. Parallel Fetching
    const [
      { data: doctorsData, error: doctorsError },
      { data: dailySchedules, error: scheduleError },
      { data: existingBookings, error: bookingError }
    ] = await Promise.all([
      // Query A: Doctors
      supabase
        .from('doctors')
        .select(`
          id, specialty, degree,
          user:users (name, is_active),
          doctor_services!inner(service_id)
        `)
        .eq('doctor_services.service_id', service_id),

      // Query B: Schedules
      supabase
        .from('doctor_schedules')
        .select('*')
        .eq('date', localDateStr)
        .eq('is_available', true),

      // Query C: Bookings active trong ngày
      supabase
        .from('bookings')
        .select(`
          doctor_id, 
          booking_time, 
          service:services(duration_minutes) 
        `)
        .gte('booking_time', `${localDateStr}T00:00:00`)
        .lte('booking_time', `${localDateStr}T23:59:59`)
        .neq('status', 'cancelled')
        .not('doctor_id', 'is', null)
    ])

    if (doctorsError) throw doctorsError
    if (scheduleError) throw scheduleError
    if (bookingError) throw bookingError

    // LOGGING: Số lượng items tìm thấy
    console.log(`Found: ${doctorsData?.length || 0} doctors, ${dailySchedules?.length || 0} schedules, ${existingBookings?.length || 0} bookings`);

    if (!doctorsData || doctorsData.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // --- XỬ LÝ CHECK BẬN ---
    const busyDoctorIds = new Set<string>();

    const reqStart = reqDate.getTime();
    const reqEnd = reqEndTime.getTime();

    if (existingBookings) {
      for (const booking of existingBookings) {
        if (!booking.service) continue;

        const bookStart = new Date(booking.booking_time).getTime();
        const bookDuration = (booking.service as { duration_minutes: number }).duration_minutes || 30;
        const bookEnd = bookStart + (bookDuration * 60000);

        // Logic Overlap: (StartA < EndB) && (EndA > StartB)
        const isOverlap = (reqStart < bookEnd) && (reqEnd > bookStart);

        if (isOverlap && booking.doctor_id) {
          busyDoctorIds.add(booking.doctor_id);
        }
      }
    }

    // 4. Filter available doctors
    const availableDoctors = doctorsData.filter(doc => {
      // 4.1 Check active
      if (doc.user?.is_active === false) return false;

      // 4.2 Check bận do trùng lịch booking khác
      if (busyDoctorIds.has(doc.id)) return false;

      // 4.3 Check có thuộc ca trực (Shift) không
      // FIX: So sánh bằng số phút thay vì chuỗi để tránh lỗi "09:00" vs "09:00:00"
      const validSchedule = dailySchedules?.find(s => {
        if (s.doctor_id !== doc.id) return false;

        const shiftStartMinutes = timeToMinutes(s.start_time);
        const shiftEndMinutes = timeToMinutes(s.end_time);

        // Logic: Shift Start <= Request Start AND Shift End >= Request End
        const isWithinShift = (shiftStartMinutes <= reqStartMinutes) && (shiftEndMinutes >= reqEndMinutes);

        // Debug log nếu cần thiết (optional)
        // if (doc.id === 'some-id') console.log('Check Shift:', { shiftStartMinutes, shiftEndMinutes, reqStartMinutes, reqEndMinutes, isWithinShift })

        return isWithinShift;
      });

      return !!validSchedule
    }).map(doc => ({
      id: doc.id,
      name: doc.user?.name,
      specialty: doc.specialty,
      degree: doc.degree
    }))

    console.log('Available Result:', availableDoctors.length);

    return NextResponse.json({ data: availableDoctors })

  } catch (error: any) {
    console.error('Find Doctors Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
