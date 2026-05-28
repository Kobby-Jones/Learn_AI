import apiClient from './client'
import type { StudentSummary, ClassroomStats, AssessmentResult, ProgressEntry, User } from '@/types'

export interface TeacherAnalytics {
  domainAverages: { domain: string; avg: number }[]
  classTrend: { date: string; overallScore: number }[]
}

export interface EngagementRow {
  studentId: string
  name: string
  completed: number
  total: number
  progressPercent: number
}

export interface EngagementResponse {
  totalAssigned: number
  completionRate: number
  averageRating: number
  students: EngagementRow[]
}

export interface ReportEntry {
  title: string
  desc: string
  date: string
  type: string
  resultId?: string
}

export interface StudentDetailResponse {
  student: User
  latestResult: AssessmentResult | null
  progress: ProgressEntry[]
  totalAssessments: number
}

export const teacherApi = {
  listStudents: () =>
    apiClient.get<StudentSummary[]>('/teacher/students').then(r => r.data),

  studentDetail: (id: string) =>
    apiClient.get<StudentDetailResponse>(`/teacher/students/${id}`).then(r => r.data),

  classroomStats: () =>
    apiClient.get<ClassroomStats>('/teacher/classroom-stats').then(r => r.data),

  analytics: () =>
    apiClient.get<TeacherAnalytics>('/teacher/analytics').then(r => r.data),

  engagement: () =>
    apiClient.get<EngagementResponse>('/teacher/recommendations-engagement').then(r => r.data),

  reports: () =>
    apiClient.get<ReportEntry[]>('/teacher/reports').then(r => r.data),
}
