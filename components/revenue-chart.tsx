/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b' }}
            dy={10}
          />
          <YAxis
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
                    <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
                    <p className="text-sm font-bold text-indigo-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value as number)}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="total"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
