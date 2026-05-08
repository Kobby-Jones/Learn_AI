import { useEffect } from 'react'
import { AppRouter } from './routes'
import { ToastContainer } from './components/ui/toast'
import { useUIStore } from './store/uiStore'

export default function App() {
  const { theme } = useUIStore()

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }, [theme])

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}
