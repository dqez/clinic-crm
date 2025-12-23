import { createClient } from '@/lib/supabase/server'
import { ExamForm } from './exam-form'
import { redirect } from 'next/navigation'

export default async function ExamPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  // Parallel Fetching: User Auth & Booking Data
  const [
    { data: { user } },
    { data: booking, error }
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('bookings')
      .select(`
          *,
          services(name),
          doctors!inner(user_id)
      `)
      .eq('id', id)
      .single()
  ])

  if (!user) redirect('/login')

  if (error || !booking) {
    return <div>Không tìm thấy lượt khám này.</div>
  }

  // Check ownership
  if (booking.doctors.user_id !== user.id) {
    return <div className="text-red-500">Bạn không có quyền truy cập lượt khám này.</div>
  }

  if (booking.status === 'completed') {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-green-600">Lượt khám này đã hoàn thành.</h1>
        <p>Vui lòng xem lại trong lịch sử bệnh án.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Phiếu khám bệnh</h1>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Bệnh nhân:</span>
            <span className="ml-2 text-slate-900 font-medium">{booking.patient_name}</span>
          </div>
          <div>
            <span className="text-slate-500">Dịch vụ:</span>
            <span className="ml-2 text-slate-900 font-medium">{booking.services?.name}</span>
          </div>
          <div>
            <span className="text-slate-500">Triệu chứng ban đầu:</span>
            <span className="ml-2 text-slate-900 italic">{booking.symptoms}</span>
          </div>
        </div>
      </div>

      <ExamForm bookingId={booking.id} />
    </div>
  )
}
