import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { authApi } from '@/api/auth'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isBootstrapping: boolean
  error: string | null

  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  /** Verify the persisted token against /auth/me on app boot. */
  bootstrap: () => Promise<void>
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
      isBootstrapping: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await authApi.login(payload)
          set({ user, token, isAuthenticated: true, isLoading: false })
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Login failed'
          set({ error: msg, isLoading: false, isAuthenticated: false })
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await authApi.register(payload)
          set({ user, token, isAuthenticated: true, isLoading: false })
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Registration failed'
          set({ error: msg, isLoading: false, isAuthenticated: false })
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      bootstrap: async () => {
        // Only meaningful if we already have a token from persisted storage
        if (!get().token) {
          set({ isBootstrapping: false })
          return
        }
        set({ isBootstrapping: true })
        try {
          const user = await authApi.me()
          set({ user, isAuthenticated: true, isBootstrapping: false })
        } catch {
          // Token expired or invalid → drop it silently
          set({ user: null, token: null, isAuthenticated: false, isBootstrapping: false })
        }
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
    },
  ),
)
