import { AdminShell } from '@/components/admin-shell'
import { ToastContainer } from '@/components/toast'
import { InteractiveTour } from '@/components/interactive-tour'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminShell>
      {children}
      <ToastContainer />
      <InteractiveTour />
    </AdminShell>
  )
}
