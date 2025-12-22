import { createClient } from '@/lib/supabase/server'
import { RevenueChart } from '@/components/revenue-chart'
import { DollarSign, Users, Calendar, Activity } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Get Today's Stats
  const todayStr = new Date().toISOString().split('T')[0]

  // Prepare date for 7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString()

  const [
    { data: paymentsToday },
    { count: bookingCount },
    { count: patientCount },
    { data: recentPayments }
  ] = await Promise.all([
    // A. Revenue Today
    supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
      .gte('payment_date', todayStr + 'T00:00:00'),

    // B. New Bookings Today
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStr + 'T00:00:00'),

    // C. Total Patients
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient'),

    // D. Recent Payments (Last 7 Days)
    supabase
      .from('payments')
      .select('amount, payment_date')
      .eq('status', 'paid')
      .gte('payment_date', sevenDaysAgoStr)
  ])

  const totalRevenueToday = paymentsToday?.reduce((sum, p) => sum + p.amount, 0) || 0

  // Aggregate Chart Data
  const chartDataMap: Record<string, number> = {}

  // Initialize last 7 days 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) // DD/MM
    chartDataMap[key] = 0
  }

  recentPayments?.forEach(p => {
    if (!p.payment_date) return
    const date = new Date(p.payment_date)
    const key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    if (chartDataMap[key] !== undefined) {
      chartDataMap[key] += p.amount
    }
  })

  const chartData = Object.keys(chartDataMap).map(key => ({
    name: key,
    total: chartDataMap[key]
  }))


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tổng quan Phòng khám</h1>
        <p className="text-slate-500 mt-2">Chào mừng trở lại! Đây là tình hình hoạt động hôm nay.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Doanh thu hôm nay</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenueToday)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium flex items-center">
              +12%
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </span>
            <span className="text-slate-400 ml-2">so với hôm qua</span>
          </div>
        </div>

        <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Đặt lịch mới</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{bookingCount || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">Hôm nay</span>
            <span className="text-slate-400 ml-2">đã được cập nhật</span>
          </div>
        </div>

        <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng Bệnh nhân</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{patientCount || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-indigo-600 font-medium">+2</span>
            <span className="text-slate-400 ml-2">tháng này</span>
          </div>
        </div>

        <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Trạng thái hệ thống</p>
              <p className="text-lg font-bold text-emerald-600 mt-2">Hoạt động tốt</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">Thời gian thực</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Doanh thu 7 ngày qua</h3>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Xem chi tiết</button>
          </div>
          <div className="p-6">
            <RevenueChart data={chartData} />
          </div>
        </div>

        <div className="col-span-3 rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden p-6">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Hoạt động gần đây</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-blue-50 shrink-0 flex items-center justify-center border border-blue-100">
                <span className="text-blue-600 text-xs font-bold">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">John Doe đã đặt lịch hẹn mới</p>
                <p className="text-xs text-slate-500 mt-1">2 phút trước</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-emerald-50 shrink-0 flex items-center justify-center border border-emerald-100">
                <span className="text-emerald-600 text-xs font-bold">$</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Thanh toán 500,000đ được ghi nhận</p>
                <p className="text-xs text-slate-500 mt-1">15 phút trước</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-50">
              <div className="h-8 w-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center border border-slate-200">
                <span className="text-slate-500 text-xs font-bold">...</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Đang tải thêm hoạt động...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
