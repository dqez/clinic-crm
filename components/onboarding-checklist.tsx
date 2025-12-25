'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle2, Circle, Sparkles } from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

const CHECKLIST_STORAGE_KEY = 'clinic-crm-onboarding-checklist'
const CHECKLIST_DISMISSED_KEY = 'clinic-crm-onboarding-dismissed'

const defaultChecklist: ChecklistItem[] = [
  { id: 'login', label: 'Đăng nhập thành công', completed: true }, // Auto-completed
  { id: 'add-doctor', label: 'Thêm bác sĩ đầu tiên', completed: false },
  { id: 'process-booking', label: 'Xử lý đơn đặt lịch đầu tiên', completed: false },
  { id: 'confirm-payment', label: 'Xác nhận thanh toán', completed: false }
]

export function OnboardingChecklist() {
  const [isMounted, setIsMounted] = useState(false)

  // Initialize state from localStorage using lazy initialization
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    if (typeof window === 'undefined') return defaultChecklist
    const savedChecklist = localStorage.getItem(CHECKLIST_STORAGE_KEY)
    if (savedChecklist) {
      try {
        return JSON.parse(savedChecklist)
      } catch (e) {
        console.error('Error parsing checklist:', e)
      }
    }
    return defaultChecklist
  })

  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem(CHECKLIST_DISMISSED_KEY) === 'true'
  })

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Save to localStorage whenever checklist changes
  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist))
  }, [checklist])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem(CHECKLIST_DISMISSED_KEY, 'true')
  }

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const completedCount = checklist.filter(item => item.completed).length
  const totalCount = checklist.length
  const progress = (completedCount / totalCount) * 100
  const isComplete = completedCount === totalCount

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted || isDismissed) {
    return null
  }

  return (
    <div className="mb-6 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isComplete ? 'Hoàn thành! 🎉' : 'Bắt đầu với Clinic CRM'}
              </h3>
              <p className="text-sm text-slate-600">
                {isComplete
                  ? 'Bạn đã hoàn tất các bước cơ bản'
                  : `${completedCount}/${totalCount} bước đã hoàn thành`}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-colors"
            aria-label="Ẩn hướng dẫn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-2">
          {checklist.map(item => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all text-left"
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${item.completed
                  ? 'text-slate-500 line-through'
                  : 'text-slate-900'
                  }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Action */}
        {isComplete && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-emerald-800 font-medium">
              🎊 Tuyệt vời! Bạn đã sẵn sàng sử dụng hệ thống
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
