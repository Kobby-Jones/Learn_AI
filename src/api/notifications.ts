import apiClient from './client'
import type { Notification } from '@/types'

export const notificationsApi = {
  list: () =>
    apiClient.get<Notification[]>('/notifications/').then(r => r.data),

  markRead: (id: string) =>
    apiClient.post<{ ok: boolean }>(`/notifications/${id}/read`).then(r => r.data),

  markAllRead: () =>
    apiClient.post<{ ok: boolean }>('/notifications/read-all').then(r => r.data),
}
