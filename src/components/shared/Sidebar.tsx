import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Brain, BookOpen, BarChart3, Settings,
  Users, ClipboardList, FileText, Bell, LogOut, ChevronLeft,
  GraduationCap, Star, Shield, Activity, MessageSquare,
  BookMarked, TrendingUp, UserCog, Database, Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Avatar } from '@/components/ui/primitives'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Take Assessment', href: '/student/assessment', icon: <Brain className="h-4 w-4" /> },
  { label: 'My Results', href: '/student/results', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Recommendations', href: '/student/recommendations', icon: <Star className="h-4 w-4" />, badge: 6 },
  { label: 'Learning Library', href: '/student/library', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'My Progress', href: '/student/progress', icon: <TrendingUp className="h-4 w-4" /> },
  { label: 'Notifications', href: '/student/notifications', icon: <Bell className="h-4 w-4" />, badge: 2 },
  { label: 'Profile', href: '/student/profile', icon: <Settings className="h-4 w-4" /> },
]

const teacherNav: NavItem[] = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'My Students', href: '/teacher/students', icon: <Users className="h-4 w-4" /> },
  { label: 'Analytics', href: '/teacher/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Reports', href: '/teacher/reports', icon: <FileText className="h-4 w-4" /> },
  { label: 'Recommendations', href: '/teacher/recommendations', icon: <BookMarked className="h-4 w-4" /> },
  { label: 'Classroom Stats', href: '/teacher/classroom', icon: <GraduationCap className="h-4 w-4" /> },
  { label: 'Profile', href: '/teacher/profile', icon: <Settings className="h-4 w-4" /> },
]

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
  { label: 'Assessments', href: '/admin/assessments', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Content', href: '/admin/content', icon: <Database className="h-4 w-4" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'System', href: '/admin/system', icon: <Monitor className="h-4 w-4" /> },
  { label: 'Audit Logs', href: '/admin/logs', icon: <Activity className="h-4 w-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Shield className="h-4 w-4" /> },
]

const navMap: Record<UserRole, NavItem[]> = {
  student: studentNav,
  teacher: teacherNav,
  admin: adminNav,
}

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const location = useLocation()
  if (!user) return null
  const nav = navMap[user.role]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 64 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full z-40 flex flex-col bg-card border-r border-border overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-border h-16 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shrink-0">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="font-display font-bold text-lg gradient-text"
              >
                LearnAI
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}>
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-hide" aria-label="Main navigation">
          {nav.map(item => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group',
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex-1 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && sidebarOpen && (
                  <span className="ml-auto text-xs bg-rose-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User area */}
        <div className="p-2 border-t border-border">
          <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg', sidebarOpen && 'mb-1')}>
            <Avatar name={user.name} size="sm" className="shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  )
}
