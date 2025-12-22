/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default async function PatientsPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = await createClient()
  const query = (await searchParams)?.q || ''

  // Build Query
  let dbQuery = supabase
    .from('users')
    .select('*, bookings:bookings!fk_bookings_user_id_users_id(count)')
    .eq('role', 'patient')

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data: patients, error } = await dbQuery

  if (error) {
    return <div>Error loading patients: {error.message}</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-slate-900 font-bold">Danh sách Bệnh nhân</h1>
        {/* Simple Search Form */}
        <form className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            name="q"
            placeholder="Tìm theo tên..."
            className="pl-10 h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            defaultValue={query}
          />
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Họ tên</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">SĐT</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lượt khám</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ngày tạo</th>
              <th className="relative px-6 py-4"><span className="sr-only">Xem</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {patients?.map((patient: any) => (
              <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                  <Link href={`/admin/patients/${patient.id}`} className="hover:text-blue-600 transition-colors">
                    {patient.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{patient.phone}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{patient.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {patient.bookings?.[0]?.count || 0}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                  {new Date(patient.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link href={`/admin/patients/${patient.id}`} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients?.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-900">Không tìm thấy bệnh nhân nào</p>
            <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  )
}
