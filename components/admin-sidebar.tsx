'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, Stethoscope, DollarSign, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Quản lý Lịch hẹn', href: '/admin/bookings', icon: Calendar },
  { name: 'Bệnh nhân', href: '/admin/patients', icon: Users },
  { name: 'Bác sĩ & Lịch', href: '/admin/doctors', icon: Stethoscope },
  { name: 'Tài chính', href: '/admin/finance', icon: DollarSign },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
        // Get name from metadata or use email prefix as fallback
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Admin111'
        setUserName(name)
        setUserRole(user.user_metadata?.role || 'admin111')
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'A'
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200 shadow-sm">
      <div className="flex h-16 items-center justify-center border-b border-slate-100 px-6">
        <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Clinic Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Sign Out Section */}
      <div className="border-t border-slate-100 p-4 space-y-2">
        {/* User Info */}
        <div className="flex items-center gap-3 rounded-xl p-2 bg-blue-50/50 border border-blue-100">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            <p className="text-xs text-slate-500 truncate">{userRole}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium',
            'text-red-600 hover:bg-red-50 hover:text-red-700',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'border border-red-200 hover:border-red-300'
          )}
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </div>
  )
}
