'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out md:hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar onLinkClick={() => setIsSidebarOpen(false)} />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-2 top-2 p-1 text-slate-500 hover:text-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-700"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
          </div>
          {/* Add Header Actions here (Notifications, Logout) */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
