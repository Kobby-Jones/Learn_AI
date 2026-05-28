import apiClient from './client'
import type { AssessmentResult } from '@/types'

export const resultsApi = {
  latest: () => apiClient.get<AssessmentResult>('/results/latest').then(r => r.data),

  all: () => apiClient.get<AssessmentResult[]>('/results/').then(r => r.data),

  byId: (id: string) =>
    apiClient.get<AssessmentResult>(`/results/${id}`).then(r => r.data),
}
