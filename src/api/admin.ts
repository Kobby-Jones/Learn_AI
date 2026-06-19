import apiClient from './client'
import type { AdminStats, User } from '@/types'

export interface AdminAssessmentRow {
  id: string
  studentId: string
  studentName: string
  status: string
  startedAt: string | null
  completedAt: string | null
  overallScore: number | null
  primaryDifficulty: string | null
}

export interface AuditLogEntry {
  id: number
  userId: string | null
  user: string
  action: string
  level: 'info' | 'success' | 'warning' | 'error'
  ip: string
  detail: string | null
  time: string
}

export interface PlatformAnalytics {
  assessmentCompletions: { month: string; count: number }[]
  userGrowth: { month: string; users: number }[]
}

export interface SystemStatus {
  systemStatus: string
  activeConnections: number
  cpuUsagePercent: number
  platform: string
  pythonVersion: string
  services: { name: string; status: string; uptime: string; ping: string }[]
}

export interface ContentOverview {
  total: number
  byDomain: Record<string, number>
  materials: any[]
}

export const adminApi = {
  stats: () => apiClient.get<AdminStats>('/admin/stats').then(r => r.data),

  listUsers: (role?: string) =>
    apiClient.get<User[]>('/admin/users', { params: role ? { role } : {} }).then(r => r.data),

  updateUser: (id: string, updates: { isActive?: boolean; role?: string; name?: string; grade?: string | null; classes?: string[] }) =>
    apiClient.patch<User>(`/admin/users/${id}`, updates).then(r => r.data),

  deleteUser: (id: string) =>
    apiClient.delete<{ message: string }>(`/admin/users/${id}`).then(r => r.data),

  listAssessments: (limit = 25) =>
    apiClient.get<AdminAssessmentRow[]>('/admin/assessments', { params: { limit } }).then(r => r.data),

  logs: (limit = 50) =>
    apiClient.get<AuditLogEntry[]>('/admin/logs', { params: { limit } }).then(r => r.data),

  analytics: () =>
    apiClient.get<PlatformAnalytics>('/admin/analytics').then(r => r.data),

  system: () =>
    apiClient.get<SystemStatus>('/admin/system').then(r => r.data),

  content: () =>
    apiClient.get<ContentOverview>('/admin/content').then(r => r.data),
}
