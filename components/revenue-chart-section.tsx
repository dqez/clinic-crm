'use client'

import { useState, useEffect, useCallback } from 'react'
import { RevenueChart } from '@/components/revenue-chart'
import { Calendar } from 'lucide-react'

type DateRange = 'week' | 'month' | 'year' | 'custom'

interface RevenueChartSectionProps {
  initialData: { name: string; total: number }[]
}

export function RevenueChartSection({ initialData }: RevenueChartSectionProps) {
  const [dateRange, setDateRange] = useState<DateRange>('week')
  const [chartData, setChartData] = useState(initialData)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchChartData = useCallback(async () => {
    setIsLoading(true)
    try {
      let startDate = new Date()
      let endDate = new Date()

      switch (dateRange) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
        case 'custom':
          if (!customStartDate || !customEndDate) {
            setIsLoading(false)
            return
          }
          startDate = new Date(customStartDate)
          endDate = new Date(customEndDate)
          break
      }

      const response = await fetch('/api/admin/revenue-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          range: dateRange
        })
      })

      if (!response.ok) throw new Error('Failed to fetch chart data')

      const data = await response.json()
      setChartData(data.chartData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, customStartDate, customEndDate])

  useEffect(() => {
    if (dateRange !== 'custom') {
      fetchChartData()
    }
  }, [dateRange, fetchChartData])

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      fetchChartData()
    }
  }

  const getTitle = () => {
    switch (dateRange) {
      case 'week':
        return 'Thanh toán đặt lịch khám 7 ngày qua'
      case 'month':
        return 'Thanh toán đặt lịch khám 30 ngày qua'
      case 'year':
        return 'Thanh toán đặt lịch khám 1 năm qua'
      case 'custom':
        return 'Thanh toán đặt lịch khám (Tùy chỉnh)'
      default:
        return 'Thanh toán đặt lịch khám'
    }
  }

  return (
    <div className="col-span-4 rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">{getTitle()}</h3>
          <p className="text-xs text-slate-500">Từ HealthBooking</p>
        </div>

        {/* Date Range Selector */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'week'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            Tuần
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'month'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            Tháng
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'year'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            Năm
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${dateRange === 'custom'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <Calendar className="h-4 w-4" />
            Tùy chỉnh
          </button>
        </div>

        {/* Custom Date Range Inputs */}
        {dateRange === 'custom' && (
          <div className="mt-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCustomDateSubmit}
              disabled={!customStartDate || !customEndDate || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Đang tải...' : 'Áp dụng'}
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <RevenueChart data={chartData} />
        )}
      </div>
    </div>
  )
}
