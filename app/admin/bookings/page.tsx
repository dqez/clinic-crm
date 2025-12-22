import { createClient } from '@/lib/supabase/server'
import { BookingClient } from './client-page' // We'll move the client logic here

// Server Component
export default async function BookingsPage() {
  const supabase = await createClient()

  // Fetch Pending Bookings
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
        id,
        booking_time,
        patient_name,
        patient_phone,
        status,
        service_id,
        services ( name )
    `)
    .eq('status', 'pending')
    .order('booking_time', { ascending: true })

  if (error) {
    return <div>Error loading bookings</div>
  }

  return (
    <div>
      <h1 className="text-2xl text-slate-900 font-bold mb-6">Xếp lịch khám</h1>
      <BookingClient initialBookings={bookings || []} />
    </div>
  )
}
