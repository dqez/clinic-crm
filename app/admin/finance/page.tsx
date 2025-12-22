import { createClient } from '@/lib/supabase/server'
import { FinanceClient } from './client-page'

export default async function FinancePage() {
  const supabase = await createClient()

  // Fetch payments with booking info
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
        id,
        amount,
        status,
        method,
        created_at,
        bookings (
            patient_name,
            services(name)
        )
    `)
    .order('created_at', { ascending: false })

  if (error) return <div>Error loading payments</div>

  return (
    <div>
      <h1 className="text-2xl text-slate-900 font-bold mb-6">Quản lý Tài chính</h1>
      <FinanceClient initialPayments={payments || []} />
    </div>
  )
}
