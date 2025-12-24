/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { BookingAssignmentModal } from '@/components/booking-assignment-modal'
import { DoctorScheduleGrid } from '@/components/doctor-schedule-grid'
import { List, Calendar } from 'lucide-react'

type ViewMode = 'list' | 'schedule'

export function BookingClient({ initialBookings }: { initialBookings: any[] }) {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const openAssign = (booking: any) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  return (
    <>
      {/* Tab Navigation */}
      <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-1 inline-flex shadow-sm">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'list'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
        >
          <List className="w-4 h-4" />
          Danh sách đặt lịch
        </button>
        <button
          onClick={() => setViewMode('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'schedule'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
        >
          <Calendar className="w-4 h-4" />
          Lịch tổng quan
        </button>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
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
          </div>
          {initialBookings.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-medium text-slate-900">Không có đơn đặt lịch nào</p>
              <p className="text-sm mt-1">Hiện tại chưa có yêu cầu mới.</p>
            </div>
          )}
        </div>
      ) : (
        <DoctorScheduleGrid />
      )}

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
