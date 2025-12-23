/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, X, User, Briefcase, Calendar, Trash2 } from 'lucide-react'

export interface Doctor {
  id: string
  user_id?: string
  specialty: string
  degree: string | null
  price_per_slot: number | null
  is_available: boolean | null
  bio: string | null
  user: {
    name: string
    is_active: boolean | null
    email?: string
    phone?: string
  } | null
}

interface Service {
  id: string
  name: string
  price: number
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

interface DoctorModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor | null
}

const DAY_LABELS: Record<keyof WeeklySchedule, string> = {
  monday: 'T2',
  tuesday: 'T3',
  wednesday: 'T4',
  thursday: 'T5',
  friday: 'T6',
  saturday: 'T7',
  sunday: 'CN'
}

type Tab = 'info' | 'services' | 'schedule'

export function DoctorModal({ isOpen, onClose, doctor }: DoctorModalProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    monday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    tuesday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    wednesday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    thursday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    friday: { enabled: true, shifts: [{ start_time: '08:00', end_time: '17:00', max_patients: 10 }] },
    saturday: { enabled: false, shifts: [] },
    sunday: { enabled: false, shifts: [] }
  })
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Store initial doctor info values
  const [doctorInfo, setDoctorInfo] = useState({
    specialty: '',
    degree: '',
    price_per_slot: 0,
    bio: ''
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (isOpen && doctor) {
      // Initialize doctor info from props
      setDoctorInfo({
        specialty: doctor.specialty || '',
        degree: doctor.degree || '',
        price_per_slot: doctor.price_per_slot || 0,
        bio: doctor.bio || ''
      })
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, doctor])

  const fetchData = async () => {
    if (!doctor) return

    // Fetch all services
    const { data: servicesData } = await supabase
      .from('services')
      .select('id, name, price')
      .order('name')

    if (servicesData) setServices(servicesData)

    // Fetch doctor's current services
    const { data: doctorServices } = await supabase
      .from('doctor_services')
      .select('service_id')
      .eq('doctor_id', doctor.id)

    if (doctorServices) {
      setSelectedServices(doctorServices.map(ds => ds.service_id))
    }

    // Set default date range (next 30 days)
    const today = new Date()
    const thirtyDaysLater = new Date(today)
    thirtyDaysLater.setDate(today.getDate() + 30)

    setStartDate(today.toISOString().split('T')[0])
    setEndDate(thirtyDaysLater.toISOString().split('T')[0])

    // TODO: Fetch existing schedules and populate weeklySchedule state
    // For now, we'll use default schedule
  }

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

  const generateSchedulesFromWeekly = () => {
    if (!startDate || !endDate) return []

    const schedules: any[] = []
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

    const formData = new FormData(e.currentTarget)

    // Get form values, fallback to stored doctorInfo if field doesn't exist in form (other tabs)
    const specialty = formData.get('specialty') as string || doctorInfo.specialty
    const degree = formData.get('degree') as string || doctorInfo.degree
    const priceStr = formData.get('price') as string
    const price = priceStr ? parseInt(priceStr) : doctorInfo.price_per_slot
    const bio = formData.get('bio') as string || doctorInfo.bio

    try {
      // Always prepare schedules (will only be used if date range is set)
      const schedulesToSubmit = generateSchedulesFromWeekly()

      // Call API to update doctor
      const res = await fetch('/api/admin/update-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: doctor!.id,
          specialty,
          degree,
          price_per_slot: price,
          bio,
          service_ids: selectedServices, // Always send services
          schedules: schedulesToSubmit, // Always send schedules
          start_date: startDate,
          end_date: endDate
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Có lỗi xảy ra khi cập nhật')
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error updating doctor:', error)
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !doctor) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Chỉnh sửa Bác sĩ: {doctor.user?.name}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'info'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <User className="w-4 h-4" />
            Thông tin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'services'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <Briefcase className="w-4 h-4" />
            Dịch vụ
            {selectedServices.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {selectedServices.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'schedule'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <Calendar className="w-4 h-4" />
            Lịch làm việc
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Họ và tên</label>
                  <input
                    disabled
                    defaultValue={doctor.user?.name}
                    className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400 mt-1">Không thể thay đổi tên tại đây.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Chuyên khoa</label>
                    <input
                      name="specialty"
                      defaultValue={doctor.specialty}
                      onChange={(e) => setDoctorInfo(prev => ({ ...prev, specialty: e.target.value }))}
                      required
                      className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Bằng cấp</label>
                    <input
                      name="degree"
                      defaultValue={doctor.degree || ''}
                      onChange={(e) => setDoctorInfo(prev => ({ ...prev, degree: e.target.value }))}
                      className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Đơn giá khám (VND)</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={doctor.price_per_slot || 0}
                    onChange={(e) => setDoctorInfo(prev => ({ ...prev, price_per_slot: parseInt(e.target.value) || 0 }))}
                    className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Giới thiệu (Bio)</label>
                  <textarea
                    name="bio"
                    rows={4}
                    defaultValue={doctor.bio || ''}
                    onChange={(e) => setDoctorInfo(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1 flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <p className="text-sm text-slate-600 mb-4">Chọn các dịch vụ mà bác sĩ có thể thực hiện:</p>
                <div className="grid grid-cols-2 gap-3">
                  {services.length === 0 ? (
                    <p className="text-sm text-slate-500 col-span-2">Đang tải...</p>
                  ) : (
                    services.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-900">{service.name}</span>
                          <span className="text-xs text-slate-500 ml-2">
                            ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)})
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Đã chọn: <strong>{selectedServices.length}</strong> dịch vụ
                </p>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-3">Áp dụng lịch tuần cho khoảng:</p>
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
                    Sẽ tạo <strong>{generateSchedulesFromWeekly().length}</strong> ngày làm việc
                  </p>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {(Object.keys(weeklySchedule) as Array<keyof WeeklySchedule>).map((day) => (
                    <div
                      key={day}
                      className={`p-3 rounded-lg border transition-all ${weeklySchedule[day].enabled
                        ? 'bg-white border-blue-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={weeklySchedule[day].enabled}
                          onChange={() => toggleDay(day)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label className="text-sm font-semibold flex-1">{DAY_LABELS[day]}</label>
                        {weeklySchedule[day].enabled && (
                          <button
                            type="button"
                            onClick={() => addWeeklyShift(day)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            + Ca
                          </button>
                        )}
                      </div>

                      {weeklySchedule[day].enabled && (
                        <div className="space-y-1 pl-6">
                          {weeklySchedule[day].shifts.map((shift, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-xs">
                              <input
                                type="time"
                                value={shift.start_time}
                                onChange={(e) => updateWeeklyShift(day, idx, 'start_time', e.target.value)}
                                className="w-20 h-7 px-1 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                              />
                              <span>-</span>
                              <input
                                type="time"
                                value={shift.end_time}
                                onChange={(e) => updateWeeklyShift(day, idx, 'end_time', e.target.value)}
                                className="w-20 h-7 px-1 rounded border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                              />
                              <input
                                type="number"
                                min="1"
                                value={shift.max_patients}
                                onChange={(e) => updateWeeklyShift(day, idx, 'max_patients', parseInt(e.target.value) || 10)}
                                className="w-16 h-7 px-1 rounded border border-slate-300 text-slate-900 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                placeholder="Max"
                              />
                              <span className="text-slate-500">BN</span>
                              {weeklySchedule[day].shifts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeWeeklyShift(day, idx)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded ml-auto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
