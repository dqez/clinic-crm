import { DoctorSidebar } from '@/components/doctor-sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Optional: Strict Role Check if middleware didn't catch it
  // (Middleware handles usually, but double check is safe)

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">Khu vực Bác sĩ</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
