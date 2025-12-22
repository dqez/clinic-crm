'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Calendar, LogOut, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'Lịch làm việc', href: '/doctor/schedule', icon: Calendar },
  // Future: History, Profile
]

export function DoctorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
        // Get name from metadata or use email prefix as fallback
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Doctor'
        setUserName(name)
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
      .slice(0, 2) || 'D'
  }

  return (
    <div className="flex h-full w-64 flex-col bg-linear-to-b from-slate-800 to-slate-900 text-white shadow-xl">
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-slate-700/50 px-6 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Doctor Portal</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg ring-1 ring-cyan-400/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Sign Out Section */}
      <div className="border-t border-slate-700/50 p-4 space-y-2 bg-slate-800/30">
        {/* User Info */}
        <div className="flex items-center gap-3 rounded-xl p-2.5 bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium',
            'text-red-400 hover:bg-red-500/10 hover:text-red-300',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'border border-red-400/20 hover:border-red-400/40'
          )}
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </div>
  )
}
