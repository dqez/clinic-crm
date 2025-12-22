import { createClient } from '@/lib/supabase/server'
import { DoctorsClient } from './client-page'

export default async function DoctorsPage() {
  const supabase = await createClient()

  // Fetch doctors with user details
  const { data: doctors } = await supabase
    .from('doctors')
    .select(`
      id,
      specialty,
      degree,
      price_per_slot,
      is_available,
      bio,
      user:users (
        name,
        email,
        phone,
        is_active
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Danh sách Bác sĩ</h1>
        <p className="text-slate-500 mt-2">Quản lý hồ sơ và thông tin chuyên môn của đội ngũ y tế.</p>
      </div>

      <DoctorsClient initialDoctors={doctors || []} />
    </div>
  )
}
