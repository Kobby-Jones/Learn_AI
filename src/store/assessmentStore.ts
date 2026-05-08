import { create } from 'zustand'
import type { AssessmentSession, StudentAnswer, AssessmentDomain, Question } from '@/types'
import { mockQuestions } from '@/mock/data'

interface AssessmentStore {
  session: AssessmentSession | null
  isAnalysing: boolean
  startSession: (assessmentId: string) => void
  answerQuestion: (questionId: string, answer: string, responseTime: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  skipQuestion: () => void
  pauseSession: () => void
  resumeSession: () => void
  submitSession: () => void
  resetSession: () => void
}

const buildDomainProgress = (questions: Question[]): Record<AssessmentDomain, { completed: number; total: number }> => {
  const domains: AssessmentDomain[] = ['mathematics', 'grammar', 'reading', 'memory', 'reasoning']
  return Object.fromEntries(
    domains.map(d => [d, { completed: 0, total: questions.filter(q => q.domain === d).length }])
  ) as Record<AssessmentDomain, { completed: number; total: number }>
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  session: null,
  isAnalysing: false,

  startSession: (assessmentId) => {
    // Sort questions by domain for a structured flow
    const ordered = ['mathematics', 'grammar', 'reading', 'memory', 'reasoning']
    const questions = [...mockQuestions].sort(
      (a, b) => ordered.indexOf(a.domain) - ordered.indexOf(b.domain)
    )
    set({
      session: {
        assessmentId,
        questions,
        currentIndex: 0,
        answers: {},
        startedAt: Date.now(),
        domainProgress: buildDomainProgress(questions),
        isPaused: false,
      },
      isAnalysing: false,
    })
  },

  answerQuestion: (questionId, answer, responseTime) => {
    const { session } = get()
    if (!session) return
    const question = session.questions.find(q => q.id === questionId)
    if (!question) return
    const isCorrect = answer === question.correctAnswer
    const newAnswers = {
      ...session.answers,
      [questionId]: { questionId, answer, responseTime, isCorrect, skipped: false },
    }
    // Update domain progress
    const domainProgress = { ...session.domainProgress }
    const domainQuestions = session.questions.filter(q => q.domain === question.domain)
    const answered = domainQuestions.filter(q => newAnswers[q.id]).length
    domainProgress[question.domain] = { ...domainProgress[question.domain], completed: answered }
    set({ session: { ...session, answers: newAnswers, domainProgress } })
  },

  nextQuestion: () => {
    const { session } = get()
    if (!session) return
    if (session.currentIndex < session.questions.length - 1) {
      set({ session: { ...session, currentIndex: session.currentIndex + 1 } })
    }
  },

  previousQuestion: () => {
    const { session } = get()
    if (!session) return
    if (session.currentIndex > 0) {
      set({ session: { ...session, currentIndex: session.currentIndex - 1 } })
    }
  },

  skipQuestion: () => {
    const { session } = get()
    if (!session) return
    const question = session.questions[session.currentIndex]
    const newAnswers = {
      ...session.answers,
      [question.id]: { questionId: question.id, answer: null, responseTime: 0, isCorrect: false, skipped: true },
    }
    set({ session: { ...session, answers: newAnswers } })
    get().nextQuestion()
  },

  pauseSession: () => {
    const { session } = get()
    if (session) set({ session: { ...session, isPaused: true } })
  },

  resumeSession: () => {
    const { session } = get()
    if (session) set({ session: { ...session, isPaused: false } })
  },

  submitSession: () => set({ isAnalysing: true }),

  resetSession: () => set({ session: null, isAnalysing: false }),
}))
