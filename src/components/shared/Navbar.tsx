import { Link } from 'react-router-dom'
import { Bell, Sun, Moon, Menu, Search } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Avatar } from '@/components/ui/primitives'
import { mockNotifications } from '@/mock/data'
import { motion } from 'framer-motion'

export function Navbar() {
  const { user } = useAuthStore()
  const { theme, setTheme, setSidebarOpen, sidebarOpen } = useUIStore()
  const unreadCount = mockNotifications.filter(n => !n.isRead).length

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20 flex items-center px-4 gap-4">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden text-muted-foreground hover:text-foreground"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>

        {/* Notifications */}
        <Link
          to={`/${user?.role}/notifications`}
          className="relative h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" aria-hidden />
          )}
        </Link>

        {/* Avatar */}
        {user && (
          <Link to={`/${user.role}/profile`} className="flex items-center gap-2 ml-1">
            <Avatar name={user.name} size="sm" />
          </Link>
        )}
      </div>
    </header>
  )
}
