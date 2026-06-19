/**
 * src/api/index.ts
 * Barrel export plus shared TanStack-Query keys.
 */
export { default as apiClient } from './client'
export { authApi } from './auth'
export { assessmentApi } from './assessment'
export { resultsApi } from './results'
export { recommendationsApi } from './recommendations'
export { usersApi } from './users'
export { adminApi } from './admin'
export { teacherApi } from './teacher'
export { notificationsApi } from './notifications'

/** Centralised TanStack Query keys so cache invalidation stays consistent. */
export const queryKeys = {
  me:              ['me'] as const,
  questions:       ['questions'] as const,
  resultLatest:    ['result', 'latest'] as const,
  results:         ['results'] as const,
  recommendations: ['recommendations'] as const,
  library:         (filters?: object) => ['library', filters] as const,
  userStats:       ['userStats'] as const,
  userProgress:    ['userProgress'] as const,
  notifications:   ['notifications'] as const,
  // Admin
  adminStats:      ['admin', 'stats'] as const,
  adminUsers:      (role?: string) => ['admin', 'users', role] as const,
  adminAssessments:['admin', 'assessments'] as const,
  adminLogs:       ['admin', 'logs'] as const,
  adminAnalytics:  ['admin', 'analytics'] as const,
  adminSystem:     ['admin', 'system'] as const,
  adminContent:    ['admin', 'content'] as const,
  // Teacher
  teacherStudents:    ['teacher', 'students'] as const,
  teacherStudent:     (id: string) => ['teacher', 'student', id] as const,
  teacherClassroom:   ['teacher', 'classroom'] as const,
  teacherAnalytics:   ['teacher', 'analytics'] as const,
  teacherEngagement:  ['teacher', 'engagement'] as const,
  teacherReports:     ['teacher', 'reports'] as const,
  teacherClasses:     ['teacher', 'classes'] as const,
}
