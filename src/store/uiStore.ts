import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
type FontSize = 'sm' | 'md' | 'lg' | 'xl'

interface UIStore {
  theme: Theme
  dyslexiaMode: boolean
  highContrast: boolean
  fontSize: FontSize
  reducedMotion: boolean
  sidebarOpen: boolean
  setTheme: (t: Theme) => void
  toggleDyslexia: () => void
  toggleHighContrast: () => void
  setFontSize: (s: FontSize) => void
  toggleReducedMotion: () => void
  setSidebarOpen: (v: boolean) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'light',
      dyslexiaMode: false,
      highContrast: false,
      fontSize: 'md',
      reducedMotion: false,
      sidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      toggleDyslexia: () => set(s => ({ dyslexiaMode: !s.dyslexiaMode })),
      toggleHighContrast: () => set(s => ({ highContrast: !s.highContrast })),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleReducedMotion: () => set(s => ({ reducedMotion: !s.reducedMotion })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: 'ui-storage' }
  )
)
