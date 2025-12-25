'use client'

import Link from 'next/link'
import { AlertCircle, Calendar, DollarSign, ArrowRight } from 'lucide-react'

interface PendingActionsProps {
  pendingBookings: number
  pendingPayments?: number
}

export function PendingActions({ pendingBookings, pendingPayments = 0 }: PendingActionsProps) {
  const hasActions = pendingBookings > 0 || pendingPayments > 0

  if (!hasActions) {
    return null // Don't show if no pending actions
  }

  return (
    <div className="mb-6 rounded-2xl bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Việc cần xử lý</h3>
            <p className="text-sm text-slate-600">Các tác vụ đang chờ bạn</p>
          </div>
        </div>

        <div className="space-y-3">
          {pendingBookings > 0 && (
            <Link
              href="/admin/bookings"
              className="group flex items-center justify-between p-4 rounded-xl bg-white border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {pendingBookings} đơn đặt lịch cần xếp
                  </p>
                  <p className="text-sm text-slate-500">
                    Bệnh nhân đang chờ được phân công bác sĩ
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-orange-600 font-medium">
                Xem ngay
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}

          {pendingPayments > 0 && (
            <Link
              href="/admin/finance"
              className="group flex items-center justify-between p-4 rounded-xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {pendingPayments} thanh toán chờ xác nhận
                  </p>
                  <p className="text-sm text-slate-500">
                    Cần xác nhận và cập nhật trạng thái
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                Xem ngay
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
