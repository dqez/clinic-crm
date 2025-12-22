/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { BookingAssignmentModal } from '@/components/booking-assignment-modal'

export function BookingClient({ initialBookings }: { initialBookings: any[] }) {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openAssign = (booking: any) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Bệnh nhân</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">SĐT</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Dịch vụ</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Giờ hẹn</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {initialBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">{booking.patient_name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{booking.patient_phone}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">{booking.services?.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                  {new Date(booking.booking_time).toLocaleString('vi-VN')}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() => openAssign(booking)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all active:scale-95"
                  >
                    Xếp lịch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialBookings.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-900">Không có đơn đặt lịch nào</p>
            <p className="text-sm mt-1">Hiện tại chưa có yêu cầu mới.</p>
          </div>
        )}
      </div>

      {selectedBooking && (
        <BookingAssignmentModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
