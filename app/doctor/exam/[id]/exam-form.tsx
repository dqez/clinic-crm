/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function ExamForm({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const diagnosis = formData.get('diagnosis') as string
    const prescription = formData.get('prescription') as string
    const doctor_notes = formData.get('doctor_notes') as string

    try {
      // 1. Insert Medical Record
      const { error: recordError } = await supabase
        .from('medical_records')
        .insert({
          booking_id: bookingId,
          diagnosis,
          prescription,
          doctor_notes
        })

      if (recordError) throw recordError

      // 2. Update Booking Status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', bookingId)

      if (bookingError) throw bookingError

      alert('Đã lưu bệnh án thành công!')
      router.push('/doctor/schedule')
      router.refresh()
    } catch (err: any) {
      alert('Lỗi: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
      <div>
        <label className="block text-sm font-medium text-slate-700">Chẩn đoán bệnh <span className="text-red-500">*</span></label>
        <textarea
          name="diagnosis"
          required
          rows={3}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:text-sm transition-all"
          placeholder="Nhập kết quả chẩn đoán..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Đơn thuốc / Chỉ định</label>
        <textarea
          name="prescription"
          rows={4}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:text-sm transition-all"
          placeholder="Tên thuốc, liều lượng..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Ghi chú của bác sĩ (cho lần sau)</label>
        <textarea
          name="doctor_notes"
          rows={2}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:text-sm transition-all"
          placeholder="Lưu ý tái khám..."
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Hoàn thành khám'}
        </button>
      </div>
    </form>
  )
}
