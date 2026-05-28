import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  res => res,
  (err: AxiosError<{ error?: string; message?: string }>) => {
    // Auto-logout on 401 — but only after we have a token, so the initial
    // /auth/me bootstrap doesn't bounce unauthenticated visitors.
    if (err.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    // Surface the server's error message
    const msg = err.response?.data?.error || err.response?.data?.message || err.message
    return Promise.reject(new Error(msg))
  },
)

export default apiClient
