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

  // --- FIX TIMEZONE ---
  // Tạo date object chuẩn
  const reqDate = new Date(booking_time);

  // Lấy ngày/giờ theo múi giờ VN để query DB chính xác
  const timeZone = 'Asia/Ho_Chi_Minh';
  const localDateStr = reqDate.toLocaleDateString('sv-SE', { timeZone }); // YYYY-MM-DD
  const localTimeStr = reqDate.toLocaleTimeString('en-GB', { timeZone, hour12: false }); // HH:mm:ss (en-GB luôn trả về 24h format chuẩn có padding 0)

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
    // Lưu ý: Tính toán cộng trừ date nên dùng timestamp gốc (UTC) để tránh sai lệch
    const reqEndTime = new Date(reqDate.getTime() + duration * 60000);
    const reqEndTimeStr = reqEndTime.toLocaleTimeString('en-GB', { timeZone, hour12: false });

    // 3. Parallel Fetching
    const [
      { data: doctorsData, error: doctorsError },
      { data: dailySchedules, error: scheduleError },
      // FIX: Query booking không chỉ theo giờ mà query HẾT booking trong ngày đó để check overlap
      { data: existingBookings, error: bookingError }
    ] = await Promise.all([
      // Query A: Doctors (giữ nguyên)
      supabase
        .from('doctors')
        .select(`
          id, specialty, degree,
          user:users (name, is_active),
          doctor_services!inner(service_id)
        `)
        .eq('doctor_services.service_id', service_id),

      // Query B: Schedules (giữ nguyên)
      supabase
        .from('doctor_schedules')
        .select('*')
        .eq('date', localDateStr)
        .eq('is_available', true),

      // Query C: FIX - Lấy tất cả booking "active" trong ngày hôm đó
      // Cần join bảng services để lấy duration của các booking cũ -> tính ra thời gian kết thúc
      supabase
        .from('bookings')
        .select(`
          doctor_id, 
          booking_time, 
          service:services(duration_minutes) 
        `)
        // Cần filter booking trong khoảng ngày đó (Start Day <= booking <= End Day)
        // FIX: Sử dụng .lte() thay vì .lt() để bao gồm cả bookings vào cuối ngày
        .gte('booking_time', `${localDateStr}T00:00:00`)
        .lte('booking_time', `${localDateStr}T23:59:59`)
        .neq('status', 'cancelled')
        .not('doctor_id', 'is', null)
    ])

    if (doctorsError) throw doctorsError
    if (scheduleError) throw scheduleError
    if (bookingError) throw bookingError

    if (!doctorsData || doctorsData.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // --- XỬ LÝ LOGIC CHECK BẬN (COLLISION DETECTION) ---
    const busyDoctorIds = new Set<string>();

    // Request Interval: [reqStart, reqEnd]
    const reqStart = reqDate.getTime();
    const reqEnd = reqEndTime.getTime();

    if (existingBookings) {
      for (const booking of existingBookings) {
        if (!booking.service) continue; // Skip nếu dữ liệu lỗi

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
      // Logic: Shift Start <= Request Start AND Shift End >= Request End
      // Tức là thời gian khách đặt phải NẰM TRỌN trong ca làm việc
      const validSchedule = dailySchedules?.find(s =>
        s.doctor_id === doc.id &&
        s.start_time <= localTimeStr &&
        s.end_time >= reqEndTimeStr // So sánh giờ kết thúc của slot với giờ kết thúc ca
      )

      return !!validSchedule
    }).map(doc => ({
      id: doc.id,
      name: doc.user?.name,
      specialty: doc.specialty,
      degree: doc.degree
    }))

    return NextResponse.json({ data: availableDoctors })

  } catch (error: any) {
    console.error('Find Doctors Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
