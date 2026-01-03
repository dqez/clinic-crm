import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { startDate, endDate, range } = await request.json()

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    // Set start to beginning of day
    start.setHours(0, 0, 0, 0)

    const end = new Date(endDate)
    // Set end to end of day to include all payments on the end date
    end.setHours(23, 59, 59, 999)

    // Fetch payments in the date range
    const { data: recentPayments } = await supabase
      .from('payments')
      .select('amount, payment_date')
      .eq('status', 'paid')
      .gte('payment_date', start.toISOString())
      .lte('payment_date', end.toISOString())

    // Generate chart data based on range
    const chartDataMap: Record<string, number> = {}

    if (range === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        chartDataMap[key] = 0
      }
    } else if (range === 'month') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        chartDataMap[key] = 0
      }
    } else if (range === 'year') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const key = d.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
        chartDataMap[key] = 0
      }
    } else if (range === 'custom') {
      // Custom range - group by days if range <= 31 days, otherwise by months
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 31) {
        // Group by days
        for (let i = 0; i <= diffDays; i++) {
          const d = new Date(start)
          d.setDate(start.getDate() + i)
          const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
          chartDataMap[key] = 0
        }
      } else {
        // Group by months
        const startMonth = new Date(start.getFullYear(), start.getMonth(), 1)
        const endMonth = new Date(end.getFullYear(), end.getMonth(), 1)
        const monthDiff = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 +
          (endMonth.getMonth() - startMonth.getMonth())

        for (let i = 0; i <= monthDiff; i++) {
          const d = new Date(startMonth)
          d.setMonth(startMonth.getMonth() + i)
          const key = d.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
          chartDataMap[key] = 0
        }
      }
    }

    // Aggregate payment data
    recentPayments?.forEach((p) => {
      if (!p.payment_date) return
      const date = new Date(p.payment_date)

      let key: string
      if (range === 'year') {
        key = date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
      } else if (range === 'custom') {
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays <= 31) {
          key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        } else {
          key = date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
        }
      } else {
        key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      }

      if (chartDataMap[key] !== undefined) {
        chartDataMap[key] += p.amount
      }
    })

    const chartData = Object.keys(chartDataMap).map((key) => ({
      name: key,
      total: chartDataMap[key]
    }))

    return NextResponse.json({ chartData })
  } catch (error) {
    console.error('Error fetching revenue chart data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
