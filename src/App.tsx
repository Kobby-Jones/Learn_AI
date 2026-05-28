import { useEffect, useState } from 'react'
import { AppRouter } from './routes'
import { ToastContainer } from './components/ui/toast'
import { useUIStore } from './store/uiStore'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { theme } = useUIStore()
  const bootstrap = useAuthStore(s => s.bootstrap)
  const [booted, setBooted] = useState(false)

  // Verify a persisted token against /auth/me on first paint
  useEffect(() => {
    bootstrap().finally(() => setBooted(true))
  }, [bootstrap])

  // Theme handling
  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }, [theme])

  if (!booted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}
