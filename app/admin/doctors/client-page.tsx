/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Search, Edit2, BadgeCheck, GraduationCap } from 'lucide-react'
import { DoctorModal } from '@/components/doctor-modal'

interface Doctor {
  id: string
  specialty: string
  degree: string | null
  price_per_slot: number | null
  is_available: boolean | null
  bio: string | null
  user: {
    name: string
    email: string
    phone: string
    is_active: boolean | null
  } | null
}

export function DoctorsClient({ initialDoctors }: { initialDoctors: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Client-side filtering
  const doctors = initialDoctors.filter((doc) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      doc.user?.name?.toLowerCase().includes(term) ||
      doc.specialty?.toLowerCase().includes(term) ||
      doc.user?.email?.toLowerCase().includes(term)
    )
  })

  const handleEdit = (doctor: any) => {
    setSelectedDoctor(doctor)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            placeholder="Tìm bác sĩ theo tên, chuyên khoa..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
                  {doctor.user?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{doctor.user?.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEdit(doctor)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <GraduationCap className="mr-2.5 h-4 w-4 text-slate-400" />
                {doctor.degree || 'Chưa cập nhật bằng cấp'}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <BadgeCheck className="mr-2.5 h-4 w-4 text-slate-400" />
                {doctor.user?.email}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Giá khám</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.price_per_slot || 0)}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${doctor.user?.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span className="ml-2 text-xs font-medium text-slate-600">
                  {doctor.user?.is_active ? 'Đang hoạt động' : 'Tạm ẩn'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-50 p-4 mb-4">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-900">Không tìm thấy bác sĩ nào</p>
          <p className="text-sm text-slate-500 mt-1">Thử thay đổi từ khóa tìm kiếm của bạn.</p>
        </div>
      )}

      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
      />
    </div>
  )
}
