import { createClient } from '@/lib/supabase/server'
import { PatientTabs } from './tabs' // Client Component from same folder

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  // Parallel Fetching
  const [userRes, bookingsRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', id).single(),
    supabase.from('bookings')
      .select(`
            *,
            services(name),
            doctors(id, specialty, user:users(name)),
            medical_records(id, diagnosis, prescription)
       `)
      .eq('user_id', id)
      .order('booking_time', { ascending: false })
  ])

  if (userRes.error || !userRes.data) {
    return <div>Patient not found</div>
  }

  const patient = userRes.data
  const history = bookingsRes.data || []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <p className="text-gray-500">Mã BN: {patient.id}</p>
      </div>

      <PatientTabs patient={patient} history={history} />
    </div>
  )
}
