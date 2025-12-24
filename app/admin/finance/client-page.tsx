/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function FinanceClient({ initialPayments }: { initialPayments: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleConfirm = async (paymentId: string) => {
    if (!confirm('Xác nhận đã nhận tiền?')) return

    setLoadingId(paymentId)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          cashier_id: user?.id,
          payment_date: new Date().toISOString()
        })
        .eq('id', paymentId)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Mã GD</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Bệnh nhân</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Dịch vụ</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Số tiền</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {initialPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500 font-mono">
                  {payment.id.slice(0, 8)}...
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                  {payment.bookings?.patient_name || 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                  {payment.bookings?.services?.name || 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-900 font-semibold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                    payment.status === 'paid'
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-amber-50 text-amber-700 ring-amber-600/20"
                  )}>
                    {payment.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {payment.status !== 'paid' && (
                    <button
                      onClick={() => handleConfirm(payment.id)}
                      disabled={loadingId === payment.id}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition-all active:scale-95"
                    >
                      {loadingId === payment.id ? '...' : 'Xác nhận thu'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {initialPayments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <p className="text-lg font-medium text-slate-900">Chưa có giao dịch nào</p>
                  <p className="text-sm mt-1">Dữ liệu sẽ xuất hiện khi có bệnh nhân thanh toán.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
