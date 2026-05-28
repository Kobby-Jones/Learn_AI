import apiClient from './client'
import type { User, LoginPayload, RegisterPayload, UserPreferences } from '@/types'

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then(r => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register', payload).then(r => r.data),

  me: () => apiClient.get<User>('/auth/me').then(r => r.data),

  updateProfile: (updates: { name?: string; avatar?: string; preferences?: Partial<UserPreferences> }) =>
    apiClient.patch<User>('/auth/me', updates).then(r => r.data),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post<{ message: string }>('/auth/change-password', { oldPassword, newPassword }).then(r => r.data),
}
