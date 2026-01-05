import { createClient } from '@/lib/supabase/server'
import { BookingClient } from './client-page' // We'll move the client logic here

// Server Component
export default async function BookingsPage() {
  const supabase = await createClient()

  // Fetch Paid Bookings (chỉ lấy những booking đã thanh toán từ web con)
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
        id,
        booking_time,
        patient_name,
        patient_phone,
        status,
        service_id,
        services ( name ),
        payments!inner (
          status,
          amount,
          payment_date
        )
    `)
    .in('status', ['paid', 'pending'])
    .eq('payments.status', 'paid')
    .order('booking_time', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return <div>Lỗi khi tải danh sách đặt lịch</div>
  }

  return (
    <div>
      <h1 className="text-2xl text-slate-900 font-bold mb-6">Xếp lịch khám</h1>
      <BookingClient initialBookings={bookings || []} />
    </div>
  )
}
