import { createClient } from '@/lib/supabase/server'
import { PatientTabs } from './tabs'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

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
      .eq('status', 'completed')
      .order('booking_time', { ascending: false })
  ])

  if (userRes.error || !userRes.data) {
    return <div>Patient not found</div>
  }

  const patient = userRes.data
  const history = bookingsRes.data || []

  return (
    <div>
      <Link
        href="/admin/patients"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Quay lại danh sách
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl text-blue-600 font-bold">{patient.name}</h1>
        <p className="text-gray-500">Mã BN: {patient.id}</p>
      </div>

      <PatientTabs patient={patient} history={history} />
    </div>
  )
}
