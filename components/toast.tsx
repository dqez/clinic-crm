'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastCounter = 0
const toastCallbacks: Set<(toast: Toast) => void> = new Set()

export function toast(message: string, type: ToastType = 'success') {
  const newToast: Toast = {
    id: `toast-${++toastCounter}`,
    message,
    type
  }

  toastCallbacks.forEach(callback => callback(newToast))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const callback = (newToast: Toast) => {
      setToasts(prev => [...prev, newToast])

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id))
      }, 5000)
    }

    toastCallbacks.add(callback)
    return () => {
      toastCallbacks.delete(callback)
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${getStyles(t.type)} animate-in slide-in-from-right duration-300`}
        >
          {getIcon(t.type)}
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
