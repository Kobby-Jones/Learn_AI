import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/shared/Sidebar'
import { Navbar } from '@/components/shared/Navbar'
import { useUIStore } from '@/store/uiStore'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { theme, dyslexiaMode, highContrast, fontSize, sidebarOpen } = useUIStore()

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
    root.classList.toggle('dyslexia-mode', dyslexiaMode)
    root.classList.toggle('high-contrast', highContrast)
    root.dataset.fontSize = fontSize
  }, [theme, dyslexiaMode, highContrast, fontSize])

  const fontSizeClass = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg' }[fontSize]

  return (
    <div className={cn('min-h-screen bg-background', fontSizeClass)}>
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 256 : 64 }}
      >
        <Navbar />
        <main className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PublicLayout() {
  const { theme } = useUIStore()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
