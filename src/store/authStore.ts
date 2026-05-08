import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { mockUser, mockTeacher, mockAdmin } from '@/mock/data'
import { sleep } from '@/lib/utils'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null })
        await sleep(1000) // Simulate API call
        try {
          // Mock auth: pick user by email pattern
          let user = mockUser
          if (payload.email.includes('teacher') || payload.email.includes('williams')) user = mockTeacher
          if (payload.email.includes('admin') || payload.email.includes('chen')) user = mockAdmin

          // Demo: any password works
          set({
            user,
            token: 'mock-jwt-token-' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          set({ error: 'Invalid email or password', isLoading: false })
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null })
        await sleep(1200)
        const newUser: User = {
          id: 'u_' + Date.now(),
          name: payload.name,
          email: payload.email,
          role: payload.role,
          createdAt: new Date().toISOString(),
          isActive: true,
          preferences: {
            theme: 'light',
            dyslexiaMode: false,
            highContrast: false,
            fontSize: 'md',
            reducedMotion: false,
            notifications: true,
          },
        }
        set({ user: newUser, token: 'mock-jwt-' + Date.now(), isAuthenticated: true, isLoading: false })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (updates) => {
        const { user } = get()
        if (user) set({ user: { ...user, ...updates } })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
