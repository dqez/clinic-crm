import { LoginForm } from "@/components/login-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Nếu đã đăng nhập, chuyển hướng dựa trên role
  if (session) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = userData?.role;

    if (role === 'admin') {
      redirect('/admin');
    } else if (role === 'doctor') {
      redirect('/doctor/schedule');
    } else {
      redirect('/'); // Patient quay về trang chủ
    }
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 relative">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center text-sm font-medium text-white hover:text-slate-900 transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Quay lại trang chủ
      </Link>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-blue-600 via-cyan-600 to-teal-500">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="space-y-6">
            {/* Logo/Icon */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">Clinic CRM</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Hệ thống quản lý<br />phòng khám hiện đại
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Nền tảng quản lý bệnh nhân, lịch hẹn và hồ sơ y tế toàn diện,
                giúp nâng cao chất lượng chăm sóc sức khỏe.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-blue-50">Quản lý bệnh nhân thông minh</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-blue-50">Lịch hẹn tự động & linh hoạt</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-blue-50">Bảo mật dữ liệu y tế tối đa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative medical icons */}
        <div className="absolute bottom-10 right-10 opacity-20">
          <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
          </svg>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  )
}
