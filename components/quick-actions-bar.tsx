'use client'

import Link from 'next/link'
import { Plus, Calendar, Search, Zap } from 'lucide-react'

export function QuickActionsBar() {
  const actions = [
    {
      label: 'Thêm Bác sĩ',
      icon: Plus,
      href: '/admin/doctors/create',
      color: 'blue'
    },
    {
      label: 'Xem Lịch',
      icon: Calendar,
      href: '/admin/bookings?view=schedule',
      color: 'indigo'
    },
    {
      label: 'Tìm Bệnh nhân',
      icon: Search,
      href: '/admin/patients',
      color: 'purple'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="mb-6 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
          Thao tác nhanh
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`
                group flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm
                transition-all duration-200 hover:shadow-md active:scale-95
                ${getColorClasses(action.color)}
              `}
            >
              <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              {action.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
