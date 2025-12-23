/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Service {
  id: string
  name: string
  price: number
}

interface Clinic {
  id: string
  name: string
}

export default function CreateDoctorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: servicesData }, { data: clinicsData }] = await Promise.all([
        supabase
          .from('services')
          .select('id, name, price')
          .order('name'),
        supabase
          .from('clinics')
          .select('id, name')
          .order('name')
      ])

      if (servicesData) setServices(servicesData)
      if (clinicsData) setClinics(clinicsData)
    }
    fetchData()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const specialty = formData.get('specialty') as string
    const clinic_id = formData.get('clinic_id') as string
    const degree = formData.get('degree') as string
    const price = formData.get('price') as string
    const bio = formData.get('bio') as string

    try {
      const res = await fetch('/api/admin/create-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          specialty,
          clinic_id,
          degree,
          price_per_slot: price,
          bio,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo tài khoản')
      }

      router.push('/admin/doctors')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle auto-filling price when service changes (optional UX improvement)
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedService = services.find(s => s.name === e.target.value)
    if (selectedService) {
      const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement
      if (priceInput && !priceInput.value) {
        priceInput.value = selectedService.price.toString()
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <Link
          href="/admin/doctors"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Thêm Bác sĩ mới</h1>
        <p className="text-slate-500 mt-2">Tạo tài khoản và hồ sơ bác sĩ vào hệ thống.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Thông tin Tài khoản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email đăng nhập <span className="text-red-500">*</span></label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="doctor@clinic.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    name="phone"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="0912..."
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Thông tin Chuyên môn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phòng khám / Cơ sở <span className="text-red-500">*</span></label>
                  <select
                    name="clinic_id"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  >
                    <option value="">-- Chọn phòng khám --</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Chuyên khoa <span className="text-red-500">*</span></label>
                  <select
                    name="specialty"
                    required
                    onChange={handleServiceChange}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  >
                    <option value="">-- Chọn chuyên khoa --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bằng cấp</label>
                  <input
                    name="degree"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="VD: Thạc sĩ, Tiến sĩ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá khám (VND)</label>
                  <input
                    name="price"
                    type="number"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giới thiệu (Bio)</label>
                  <textarea
                    name="bio"
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 p-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans resize-none"
                    placeholder="Thông tin giới thiệu về bác sĩ..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 flex items-center justify-between">
            {error && (
              <p className="text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/admin/doctors"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:border-slate-300 border border-transparent transition-all"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Tạo tài khoản
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
