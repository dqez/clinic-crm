/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/toast'

interface Doctor {
  id: string
  name: string
  specialty: string
  degree: string | null
}

interface BookingAssignmentModalProps {
  booking: any
  isOpen: boolean
  onClose: () => void
}

export function BookingAssignmentModal({ booking, isOpen, onClose }: BookingAssignmentModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true)
      setDoctors([]) // Clear previous state to avoid showing stale data while loading
      try {
        const res = await fetch('/api/admin/find-doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: booking.service_id,
            booking_time: booking.booking_time
          })
        })
        const json = await res.json()
        if (json.data) {
          setDoctors(json.data)
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
        toast('Không thể tải danh sách bác sĩ', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchDoctors()
    }
  }, [isOpen, booking])

  const handleAssign = async (doctorId: string) => {
    setAssigning(true)
    try {
      // Update Booking Logic
      // 1. Get Current User (Admin) ID
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('bookings')
        .update({
          doctor_id: doctorId,
          status: 'confirmed',
          assigned_by: user?.id
        })
        .eq('id', booking.id)

      if (error) throw error

      // Success!
      toast('Đã phân công bác sĩ thành công!', 'success')
      onClose()

      // Auto-refresh to show updated data
      setTimeout(() => {
        router.refresh()
      }, 300) // Small delay for smooth UX

    } catch (err: any) {
      // Error handling with specific messages
      const errorMessage = err.message || 'Có lỗi xảy ra khi phân công bác sĩ'
      toast(errorMessage, 'error')
      console.error('Assignment error:', err)
    } finally {
      setAssigning(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg text-slate-900 font-bold mb-4">Xếp lịch cho BN: {booking.patient_name}</h3>

        <p className="mb-2 text-sm text-slate-900">
          Dịch vụ: {booking.services?.name} <br />
          Thời gian: {new Date(booking.booking_time).toLocaleString('vi-VN')}
        </p>

        <h4 className="font-semibold mt-4 mb-2 text-slate-900">Bác sĩ phù hợp:</h4>

        {loading ? <p>Đang tìm...</p> : (
          <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
            {doctors.length === 0 ? <p className="text-red-500">Không tìm thấy bác sĩ rảnh vào giờ này.</p> : null}

            {doctors.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-slate-900">{doc.degree} {doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.specialty}</p>
                </div>
                <button
                  onClick={() => handleAssign(doc.id)}
                  disabled={assigning}
                  className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {assigning ? '...' : 'Chọn'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded px-4 py-2 text-sm hover:bg-gray-100 text-slate-900">
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
