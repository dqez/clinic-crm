import { createClient } from '@/lib/supabase/server'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DoctorSchedulePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Please login</div>

  // Parallel Fetching: Check Doctor Status & Get Bookings
  const [
    { data: doctor },
    { data: bookings }
  ] = await Promise.all([
    // Query A: Verify Doctor exists
    supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .single(),

    // Query B: Get Bookings directly linked to this user's doctor profile
    supabase
      .from('bookings')
      .select(`
          id,
          booking_time,
          patient_name,
          patient_phone,
          status,
          symptoms,
          services(name),
          doctors!inner(user_id)
      `)
      .eq('doctors.user_id', user.id)
      .in('status', ['confirmed']) // Only confirmed bookings ready for exam
      .order('booking_time', { ascending: true })
  ])

  if (!doctor) {
    return <div className="p-6 text-red-500">Tài khoản này chưa được liên kết với hồ sơ Bác sĩ.</div>
  }

  return (
    <div>
      <h1 className="text-2xl text-slate-900 font-bold mb-6">Lịch khám hôm nay & Sắp tới</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings?.map((booking) => (
          <div key={booking.id} className="relative flex flex-col rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {booking.services?.name}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {new Date(booking.booking_time).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">{booking.patient_name}</h3>
              <p className="text-sm text-gray-500 mb-4">{booking.patient_phone}</p>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="mr-2 h-4 w-4" />
                {new Date(booking.booking_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </div>

              {booking.symptoms && (
                <p className="text-sm text-gray-600 italic line-clamp-2">
                  &quot;Triệu chứng: {booking.symptoms}&quot;
                </p>
              )}
            </div>

            <div className="mt-6">
              <Link
                href={`/doctor/exam/${booking.id}`}
                className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Bắt đầu khám
              </Link>
            </div>
          </div>
        ))}
        {bookings?.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 border-2 border-dashed rounded-lg">
            Hiện tại chưa có lịch khám nào được phân công.
          </div>
        )}
      </div>
    </div>
  )
}
