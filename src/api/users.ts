import apiClient from './client'
import type { StudentStats, ProgressEntry } from '@/types'

export const usersApi = {
  stats: () => apiClient.get<StudentStats>('/users/stats').then(r => r.data),
  progress: () => apiClient.get<ProgressEntry[]>('/users/progress').then(r => r.data),
}
