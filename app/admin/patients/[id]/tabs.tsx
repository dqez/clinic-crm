/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function PatientTabs({ patient, history }: { patient: any, history: any[] }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            Thông tin chung
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            Lịch sử khám bệnh ({history.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Thông tin cá nhân</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.phone}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {patient.is_active ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.map((booking) => (
              <div key={booking.id} className="rounded-lg bg-white p-6 shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">
                      {new Date(booking.booking_time).toLocaleDateString('vi-VN')} - {booking.services?.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Bác sĩ: {
                        booking.doctors?.user?.name || 'Chưa phân công'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      Triệu chứng: {booking.symptoms || 'Không ghi nhận'}
                    </p>
                  </div>
                  <div>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      booking.status === 'completed' ? "bg-green-100 text-green-800" :
                        booking.status === 'confirmed' ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                    )}>
                      {booking.status === 'completed' ? 'Hoàn thành' :
                        booking.status === 'confirmed' ? 'Đã xác nhận' :
                          'Chờ xác nhận'}
                    </span>
                  </div>
                </div>

                {booking.medical_records && (
                  <div className="mt-4 border-t pt-4 bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-semibold text-gray-900">Kết quả khám:</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Chẩn đoán:</span> {booking.medical_records.diagnosis}
                    </p>
                    {booking.medical_records.prescription && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Đơn thuốc:</span> {booking.medical_records.prescription}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {history.length === 0 && <p className="text-gray-500">Chưa có lịch sử khám.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
