import { createClient } from '@/lib/supabase/server'
import { RevenueChartSection } from '@/components/revenue-chart-section'
import { PendingActions } from '@/components/pending-actions'
import { QuickActionsBar } from '@/components/quick-actions-bar'
import { OnboardingChecklist } from '@/components/onboarding-checklist'
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
    { data: recentPayments },
    { data: latestBookings },
    { data: latestPayments },
    { count: pendingBookingsCount }
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
      .gte('payment_date', sevenDaysAgoStr),

    // E. Recent Bookings (Activity Feed)
    supabase
      .from('bookings')
      .select('id, patient_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),

    // F. Recent Payments (Activity Feed)
    supabase
      .from('payments')
      .select('id, amount, created_at')
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(5),

    // G. Pending Bookings Count (đã thanh toán, chưa xếp lịch)
    supabase
      .from('bookings')
      .select('payments!inner(status)', { count: 'exact', head: true })
      .in('status', ['paid', 'pending'])
      .eq('payments.status', 'paid')
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

  // Combine & Sort Activities
  const activities = [
    ...(latestBookings?.map(b => ({
      type: 'booking',
      id: b.id,
      title: `${b.patient_name} đã đặt lịch hẹn mới`,
      amount: 0,
      time: b.created_at || new Date().toISOString(),
      initials: b.patient_name ? b.patient_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??'
    })) || []),
    ...(latestPayments?.map(p => ({
      type: 'payment',
      id: p.id,
      title: `Thanh toán ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.amount ?? 0)} được ghi nhận`,
      amount: p.amount,
      time: p.created_at || new Date().toISOString(),
      initials: '$'
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5)

  function timeAgo(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Vừa xong'
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ngày trước`
  }


  return (
    <div className="space-y-8">
      {/* Pending Actions - Hero Section */}
      <div data-tour="pending-actions">
        <PendingActions
          pendingBookings={pendingBookingsCount || 0}
        />
      </div>

      {/* Quick Actions Bar */}
      <div data-tour="quick-actions">
        <QuickActionsBar />
      </div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tổng quan Phòng khám</h1>
        <p className="text-slate-500 mt-2">Chào mừng trở lại! Đây là tình hình hoạt động hôm nay.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" data-tour="stats">
        <div className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Thanh toán đặt lịch khám</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenueToday)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">Từ HealthBooking hôm nay</span>
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
        <RevenueChartSection initialData={chartData} />

        <div className="col-span-3 rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden p-6">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Hoạt động gần đây</h3>
          <div className="space-y-6">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex gap-4">
                  <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border ${activity.type === 'booking'
                    ? 'bg-blue-50 border-blue-100 text-blue-600'
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    }`}>
                    <span className="text-xs font-bold">{activity.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{timeAgo(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Chưa có hoạt động nào gần đây.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
