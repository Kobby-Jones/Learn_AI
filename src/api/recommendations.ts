import apiClient from './client'
import type { LearningMaterial, RecommendationSet } from '@/types'

export interface RecommendationsResponse {
  id: string | null
  studentId: string | null
  assessmentResultId: string | null
  generatedAt: string | null
  primaryFocus: string | null
  materials: LearningMaterial[]
}

export const recommendationsApi = {
  list: () =>
    apiClient.get<RecommendationsResponse>('/recommendations/').then(r => r.data),

  library: (filters?: { domain?: string; format?: string }) =>
    apiClient
      .get<LearningMaterial[]>('/recommendations/library', { params: filters })
      .then(r => r.data),

  toggleBookmark: (materialId: string) =>
    apiClient.post<{ bookmarked: boolean }>(`/recommendations/bookmark/${materialId}`).then(r => r.data),

  updateProgress: (materialId: string, progressPercent: number) =>
    apiClient
      .post<{ progressPercent: number }>(`/recommendations/progress/${materialId}`, { progressPercent })
      .then(r => r.data),
}
