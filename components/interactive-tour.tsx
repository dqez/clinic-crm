'use client'

import { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface TourStep {
  target: string // CSS selector
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STORAGE_KEY = 'clinic-crm-tour-completed'

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="pending-actions"]',
    title: 'Việc cần xử lý',
    content: 'Đây là nơi hiển thị các tác vụ quan trọng cần bạn xử lý ngay, như đơn đặt lịch chờ phân công bác sĩ.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="quick-actions"]',
    title: 'Thao tác nhanh',
    content: 'Sử dụng các shortcuts này để nhanh chóng thực hiện các tác vụ phổ biến như thêm bác sĩ hoặc tìm kiếm bệnh nhân.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="stats"]',
    title: 'Thống kê tổng quan',
    content: 'Xem các chỉ số quan trọng như doanh thu, đặt lịch mới và tổng số bệnh nhân trong ngày.',
    placement: 'top'
  },
  {
    target: '[data-tour="sidebar"]',
    title: 'Menu điều hướng',
    content: 'Sử dụng menu bên trái để truy cập các phần khác nhau: Lịch hẹn, Bác sĩ và Bệnh nhân',
    placement: 'right'
  }
]

export function InteractiveTour() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  // Force update trigger
  const [_, setTick] = useState(0)
  const forceUpdate = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    // Check if tour has been completed
    if (typeof window !== 'undefined') {
      const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY)
      if (tourCompleted !== 'true') {
        const timer = setTimeout(() => {
          setIsActive(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  // Setup scroll/resize listeners to track element position
  useEffect(() => {
    if (!isActive) return

    const updatePosition = () => {
      forceUpdate()
    }

    // Capture true is important to detect scrolling of internal containers
    window.addEventListener('scroll', updatePosition, { capture: true })
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, { capture: true })
      window.removeEventListener('resize', updatePosition)
    }
  }, [isActive, forceUpdate])

  useLayoutEffect(() => {
    if (isActive) {
      const step = tourSteps[currentStep]

      // Try to find element with retry and visibility check
      const findElement = () => {
        const elements = document.querySelectorAll(step.target)

        if (elements.length === 0) {
          console.error('Tour: No elements found for selector:', step.target)
          return null
        }

        // Find the first element that has dimensions (is visible)
        for (const el of Array.from(elements)) {
          const rect = el.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            return el as HTMLElement
          }
        }

        console.warn(`Tour: Found ${elements.length} elements for ${step.target} but all have 0 dimensions.`)
        return null
      }

      // Initial attempt
      let element = findElement()

      // If not found, retry after a short delay (element might be rendering)
      if (!element) {
        const retryTimer = setTimeout(() => {
          element = findElement()
          if (element) {
            setTargetElement(element)
          } else {
            console.error('Tour: Failed to find element after retry:', step.target)
          }
        }, 200)
        return () => clearTimeout(retryTimer)
      }

      // eslint-disable-next-line
      setTargetElement(element)
    }
  }, [isActive, currentStep])

  // Scroll to element when it changes
  useEffect(() => {
    if (targetElement && isActive) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [targetElement, isActive])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setTargetElement(null)
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setTargetElement(null)
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    setIsActive(false)
    localStorage.setItem(TOUR_STORAGE_KEY, 'true')
  }

  const skipTour = () => {
    completeTour()
  }

  if (!isActive || !targetElement || typeof document === 'undefined') return null

  const step = tourSteps[currentStep]
  const rect = targetElement.getBoundingClientRect()

  // Validate rect has dimensions
  if (rect.width === 0 || rect.height === 0) {
    console.warn('Target element has no dimensions:', step.target)
    return null
  }

  // Fixed positioning logic (Viewport relative)
  const getTooltipStyle = () => {
    const offset = 20
    let top = 0
    let left = 0

    switch (step.placement) {
      case 'bottom':
        top = rect.bottom + offset
        left = rect.left + rect.width / 2
        break
      case 'top':
        top = rect.top - offset
        left = rect.left + rect.width / 2
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - offset
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + offset
        break
      default:
        top = rect.bottom + offset
        left = rect.left + rect.width / 2
    }

    return { top, left }
  }

  const tooltipPosition = getTooltipStyle()

  // Use Portal to render outside of any overflow:hidden containers
  return createPortal(
    <>
      <div className="fixed inset-0 z-9999 bg-black/60 duration-300 transition-opacity" />

      {/* Debug Info */}
      {/* <div className="fixed top-4 right-4 z-[10002] bg-white rounded-lg shadow-xl p-4 text-xs font-mono">
        <div className="font-bold mb-2 text-slate-900">Debug Tour Step {currentStep + 1}</div>
        <div className="space-y-1 text-slate-700">
          <div>Target: {step.target}</div>
          <div>Placement: {step.placement}</div>
          <div>Rect Top: {Math.round(rect.top)}px</div>
          <div>Rect Left: {Math.round(rect.left)}px</div>
          <div>Rect Width: {Math.round(rect.width)}px</div>
          <div>Rect Height: {Math.round(rect.height)}px</div>
          <div>Rect Right: {Math.round(rect.right)}px</div>
          <div>Rect Bottom: {Math.round(rect.bottom)}px</div>
        </div>
      </div> */}

      {/* Spotlight effect */}
      <div
        className="fixed z-10000 pointer-events-none transition-all duration-300 ease-out"
        style={{
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px 4px rgba(59, 130, 246, 0.5)',
          borderRadius: '12px'
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-10001 duration-300 transition-all ease-out"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: step.placement === 'bottom' || step.placement === 'top'
            ? 'translateX(-50%)'
            : step.placement === 'left'
              ? 'translate(-100%, -50%)'
              : 'translateY(-50%)',
          maxWidth: '400px'
        }}
      >
        <div className="rounded-2xl bg-white shadow-2xl border border-blue-200 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-blue-100 mt-1">
                  Bước {currentStep + 1} / {tourSteps.length}
                </p>
              </div>
              <button
                onClick={skipTour}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-700 leading-relaxed">{step.content}</p>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50">
            <button
              onClick={skipTour}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Bỏ qua
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                {currentStep < tourSteps.length - 1 ? (
                  <>
                    Tiếp
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  'Hoàn thành'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
