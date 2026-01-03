/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save, Plus, Trash2, Calendar, Clock } from 'lucide-react'
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

interface Shift {
  start_time: string
  end_time: string
  max_patients: number
}

interface DaySchedule {
  enabled: boolean
  shifts: Shift[]
}

interface WeeklySchedule {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

interface SpecificDateSchedule {
  date: string
  shifts: Shift[]
}

const DAY_LABELS: Record<keyof WeeklySchedule, string> = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ nhật'
}

export default function CreateDoctorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Weekly recurring schedule (default)
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    monday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    tuesday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    wednesday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    thursday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    friday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    saturday: { enabled: false, shifts: [] },
    sunday: { enabled: false, shifts: [] }
  })

  // Date range for weekly schedule
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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

      // Set default date range (next 30 days)
      const today = new Date()
      const thirtyDaysLater = new Date(today)
      thirtyDaysLater.setDate(today.getDate() + 30)

      setStartDate(today.toISOString().split('T')[0])
      setEndDate(thirtyDaysLater.toISOString().split('T')[0])
    }
    fetchData()
  }, [supabase])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const toggleDay = (day: keyof WeeklySchedule) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        shifts: !prev[day].enabled && prev[day].shifts.length === 0
          ? [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }]
          : prev[day].shifts
      }
    }))
  }

  const addWeeklyShift = (day: keyof WeeklySchedule) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: [...prev[day].shifts, { start_time: '08:00', end_time: '17:00', max_patients: 10 }]
      }
    }))
  }

  const removeWeeklyShift = (day: keyof WeeklySchedule, shiftIndex: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: prev[day].shifts.filter((_, i) => i !== shiftIndex)
      }
    }))
  }

  const updateWeeklyShift = (
    day: keyof WeeklySchedule,
    shiftIndex: number,
    field: keyof Shift,
    value: string | number
  ) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: prev[day].shifts.map((shift, i) =>
          i === shiftIndex ? { ...shift, [field]: value } : shift
        )
      }
    }))
  }

  // Convert weekly schedule to date-specific schedules
  const generateSchedulesFromWeekly = (): SpecificDateSchedule[] => {
    if (!startDate || !endDate) return []

    const schedules: SpecificDateSchedule[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    const dayMap: Record<number, keyof WeeklySchedule> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      const dayKey = dayMap[dayOfWeek]
      const daySchedule = weeklySchedule[dayKey]

      if (daySchedule.enabled && daySchedule.shifts.length > 0) {
        schedules.push({
          date: d.toISOString().split('T')[0],
          shifts: daySchedule.shifts
        })
      }
    }

    return schedules
  }

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

    // Validation
    if (selectedServices.length === 0) {
      setError('Vui lòng chọn ít nhất một dịch vụ')
      setLoading(false)
      return
    }

    try {
      const schedulesToSubmit = generateSchedulesFromWeekly()

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
          service_ids: selectedServices,
          schedules: schedulesToSubmit
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

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <Link
          href="/admin/doctors"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Thêm Bác sĩ mới</h1>
        <p className="text-slate-500 mt-2">Tạo tài khoản, cấu hình dịch vụ và lịch làm việc hàng tuần cho bác sĩ.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
          <div className="p-6 space-y-6">
            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Thông tin Tài khoản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email đăng nhập <span className="text-red-500">*</span></label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
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
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    name="phone"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="0912..."
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
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
                  <input
                    name="specialty"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="VD: Nội khoa, Nhi khoa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bằng cấp</label>
                  <input
                    name="degree"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="VD: Thạc sĩ, Tiến sĩ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá khám (VND)</label>
                  <input
                    name="price"
                    type="number"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giới thiệu (Bio)</label>
                  <textarea
                    name="bio"
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 p-3 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans resize-none"
                    placeholder="Thông tin giới thiệu về bác sĩ..."
                  />
                </div>
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Dịch vụ bác sĩ thực hiện <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                {services.length === 0 ? (
                  <p className="text-sm text-slate-500 col-span-2">Đang tải dịch vụ...</p>
                ) : (
                  services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-900">{service.name}</span>
                        {/* <span className="text-xs text-slate-500 ml-2">
                          ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)})
                        </span> */}
                      </div>
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Đã chọn: <strong>{selectedServices.length}</strong> dịch vụ
              </p>
            </div>

            {/* Weekly Schedule Builder */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                <Clock className="w-5 h-5 inline mr-2" />
                Lịch làm việc hàng tuần
              </h3>

              {/* Date Range */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-3">Áp dụng lịch tuần cho khoảng thời gian:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Từ ngày</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-9 px-3 rounded border border-blue-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Đến ngày</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 px-3 rounded border border-blue-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Hệ thống sẽ tự động tạo lịch cho <strong>{generateSchedulesFromWeekly().length}</strong> ngày làm việc
                </p>
              </div>

              {/* Weekly Days */}
              <div className="space-y-3">
                {(Object.keys(weeklySchedule) as Array<keyof WeeklySchedule>).map((day) => (
                  <div
                    key={day}
                    className={`p-4 rounded-lg border-2 transition-all ${weeklySchedule[day].enabled
                      ? 'bg-white border-blue-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={weeklySchedule[day].enabled}
                        onChange={() => toggleDay(day)}
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20"
                      />
                      <label className="text-sm font-semibold text-slate-900 flex-1">
                        {DAY_LABELS[day]}
                      </label>
                      {weeklySchedule[day].enabled && (
                        <button
                          type="button"
                          onClick={() => addWeeklyShift(day)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + Thêm ca
                        </button>
                      )}
                    </div>

                    {weeklySchedule[day].enabled && (
                      <div className="space-y-2 pl-8">
                        {weeklySchedule[day].shifts.map((shift, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-200">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs text-slate-600 mb-1">Giờ bắt đầu</label>
                                <input
                                  type="time"
                                  value={shift.start_time}
                                  onChange={(e) => updateWeeklyShift(day, idx, 'start_time', e.target.value)}
                                  className="w-full h-8 px-2 rounded border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-600 mb-1">Giờ kết thúc</label>
                                <input
                                  type="time"
                                  value={shift.end_time}
                                  onChange={(e) => updateWeeklyShift(day, idx, 'end_time', e.target.value)}
                                  className="w-full h-8 px-2 rounded border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-600 mb-1">Số BN tối đa</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={shift.max_patients}
                                  onChange={(e) => updateWeeklyShift(day, idx, 'max_patients', parseInt(e.target.value) || 10)}
                                  className="w-full h-8 px-2 rounded border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                              </div>
                            </div>
                            {weeklySchedule[day].shifts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeWeeklyShift(day, idx)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Xóa ca"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-3">
                💡 Tip: Tích chọn các ngày làm việc và thiết lập ca làm việc. Hệ thống sẽ tự động tạo lịch cho khoảng thời gian đã chọn.
              </p>
            </div>
          </div>

          {/* Form Actions */}
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
