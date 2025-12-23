'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react'

interface DoctorSchedule {
  doctor_id: string
  doctor_name: string
  shifts: {
    date: string
    start_time: string
    end_time: string
    max_patients: number
    booked_count: number
    status: 'available' | 'busy' | 'full'
  }[]
}

export function DoctorScheduleGrid() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [loading, setLoading] = useState(true)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const fetchSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const startDate = format(currentWeekStart, 'yyyy-MM-dd')
      const endDate = format(addDays(currentWeekStart, 6), 'yyyy-MM-dd')

      const response = await fetch(`/api/admin/doctor-schedules?start=${startDate}&end=${endDate}`)
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }, [currentWeekStart])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const previousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7))
  }

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7))
  }

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const getShiftsForDoctorAndDay = (doctorId: string, date: Date) => {
    const doctor = schedules.find(s => s.doctor_id === doctorId)
    if (!doctor) return []

    return doctor.shifts.filter(shift =>
      isSameDay(new Date(shift.date), date)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'full':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Còn trống'
      case 'busy':
        return 'Đang bận'
      case 'full':
        return 'Hết chỗ'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-600">Đang tải lịch làm việc...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">
            Tuần từ {format(currentWeekStart, 'dd/MM/yyyy', { locale: vi })} - {format(addDays(currentWeekStart, 6), 'dd/MM/yyyy', { locale: vi })}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hôm nay
          </button>
          <button
            onClick={previousWeek}
            className="p-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextWeek}
            className="p-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bác sĩ
                  </span>
                </div>
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toString()}
                  className={`px-4 py-4 text-center min-w-[160px] ${isSameDay(day, new Date()) ? 'bg-indigo-50' : ''
                    }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {format(day, 'EEEE', { locale: vi })}
                    </span>
                    <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'text-indigo-600' : 'text-slate-700'
                      }`}>
                      {format(day, 'dd/MM', { locale: vi })}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className="text-lg font-medium text-slate-900">Không có lịch làm việc</p>
                  <p className="text-sm text-slate-500 mt-1">Chưa có bác sĩ nào có lịch trong tuần này</p>
                </td>
              </tr>
            ) : (
              schedules.map((doctor) => (
                <tr key={doctor.doctor_id} className="hover:bg-slate-50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 font-medium text-slate-900 border-r border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-indigo-600">
                          {doctor.doctor_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="whitespace-nowrap">{doctor.doctor_name}</span>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const shifts = getShiftsForDoctorAndDay(doctor.doctor_id, day)
                    return (
                      <td
                        key={`${doctor.doctor_id}-${day.toString()}`}
                        className={`px-2 py-4 align-top ${isSameDay(day, new Date()) ? 'bg-indigo-50/50' : ''
                          }`}
                      >
                        {shifts.length > 0 ? (
                          <div className="space-y-2">
                            {shifts.map((shift, idx) => (
                              <div
                                key={idx}
                                className={`rounded-lg border p-2 text-xs transition-all hover:shadow-md ${getStatusColor(shift.status)}`}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <Clock className="w-3 h-3" />
                                  <span className="font-semibold">
                                    {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                                  </span>
                                </div>
                                <div className="text-[10px] opacity-90">
                                  {shift.booked_count}/{shift.max_patients} bệnh nhân
                                </div>
                                <div className="text-[10px] font-medium mt-1">
                                  {getStatusText(shift.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-slate-400 text-xs py-4">
                            Không có ca
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Chú thích:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-sm text-slate-600">Còn trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-sm text-slate-600">Đang bận (≥50% chỗ)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-sm text-slate-600">Hết chỗ</span>
          </div>
        </div>
      </div>
    </div>
  )
}
