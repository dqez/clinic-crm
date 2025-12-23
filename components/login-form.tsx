'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, AlertCircle, Stethoscope } from 'lucide-react'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!session) throw new Error('No session found')

      // 2. Lấy Role từ bảng public.users dựa trên ID người dùng vừa đăng nhập
      const { data: userData } = await supabase
        .from('users') // Tên bảng của bạn
        .select('role')
        .eq('id', session.user.id)
        .single() // Lấy 1 dòng duy nhất

      const role = userData?.role // Lấy role từ đây

      // 3. Điều hướng
      router.refresh()
      if (role === 'admin') {
        router.push('/admin')
      } else if (role === 'doctor') {
        router.push('/doctor/schedule')
      } else {
        router.push('/') // Hoặc trang mặc định cho patient
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card with glassmorphism effect */}
      <div className="relative">
        {/* Decorative gradient blur */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            {/* Medical Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Đăng nhập
              </h1>
              <p className="text-gray-500 mt-2">
                Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="email">
                <Mail className="w-4 h-4 text-blue-500" />
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`
                    w-full h-12 px-4 rounded-xl border-2 bg-white/50 backdrop-blur
                    text-gray-800 placeholder-gray-400
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:bg-white
                    ${focusedField === 'email'
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  placeholder="doctor@clinic.com"
                />
                {focusedField === 'email' && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="password">
                <Lock className="w-4 h-4 text-blue-500" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`
                    w-full h-12 px-4 rounded-xl border-2 bg-white/50 backdrop-blur
                    text-gray-800 placeholder-gray-400
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:bg-white
                    ${focusedField === 'password'
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  placeholder="••••••••"
                />
                {focusedField === 'password' && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Tài khoản hoặc mật khẩu không chính xác</p>
                  {/* <p className="text-sm text-red-600 mt-1">{error}</p> */}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                relative w-full h-12 rounded-xl font-semibold text-white
                bg-linear-to-r from-blue-600 to-cyan-600
                hover:from-blue-700 hover:to-cyan-700
                shadow-lg shadow-blue-500/30
                transition-all duration-300 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98]
                overflow-hidden
              `}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Đăng nhập
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Bảo mật dữ liệu y tế theo tiêu chuẩn{' '}
              <span className="font-semibold text-blue-600">HIPAA</span>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Cần hỗ trợ?{' '}
          <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Liên hệ IT Support
          </a>
        </p>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

