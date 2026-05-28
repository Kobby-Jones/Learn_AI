import apiClient from './client'
import type { Question, StudentAnswer } from '@/types'

export interface SubmitPayload {
  answers: Record<string, {
    answer: string | null
    responseTime: number
    skipped: boolean
    isCorrect?: boolean | null
  }>
}

export const assessmentApi = {
  getQuestions: () =>
    apiClient.get<Question[]>('/assessment/questions').then(r => r.data),

  start: () =>
    apiClient.post<{ assessmentId: string }>('/assessment/start').then(r => r.data),

  submit: (assessmentId: string, payload: SubmitPayload) =>
    apiClient.post<{ resultId: string; message: string }>(
      `/assessment/${assessmentId}/submit`,
      payload,
    ).then(r => r.data),

  getStatus: (assessmentId: string) =>
    apiClient.get<{ status: string }>(`/assessment/${assessmentId}/status`).then(r => r.data),
}
