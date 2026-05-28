import { create } from 'zustand'
import type { AssessmentSession, AssessmentDomain, Question } from '@/types'
import { assessmentApi } from '@/api/assessment'

interface AssessmentStore {
  session: AssessmentSession | null
  isAnalysing: boolean
  isStarting: boolean
  resultId: string | null
  error: string | null

  /** Create an assessment on the server and load the question bank. */
  startSession: () => Promise<void>
  answerQuestion: (questionId: string, answer: string, responseTime: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  skipQuestion: () => void
  pauseSession: () => void
  resumeSession: () => void
  /** Push all collected answers to the backend, kick off ML scoring. */
  submitSession: () => Promise<string | null>
  resetSession: () => void
}

const ORDER: AssessmentDomain[] = ['mathematics', 'grammar', 'reading', 'memory', 'reasoning']

const buildDomainProgress = (questions: Question[]) =>
  Object.fromEntries(
    ORDER.map(d => [d, { completed: 0, total: questions.filter(q => q.domain === d).length }]),
  ) as Record<AssessmentDomain, { completed: number; total: number }>

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  session: null,
  isAnalysing: false,
  isStarting: false,
  resultId: null,
  error: null,

  startSession: async () => {
    set({ isStarting: true, error: null, resultId: null })
    try {
      const [{ assessmentId }, questions] = await Promise.all([
        assessmentApi.start(),
        assessmentApi.getQuestions(),
      ])
      const ordered = [...questions].sort(
        (a, b) => ORDER.indexOf(a.domain) - ORDER.indexOf(b.domain),
      )
      set({
        session: {
          assessmentId,
          questions: ordered,
          currentIndex: 0,
          answers: {},
          startedAt: Date.now(),
          domainProgress: buildDomainProgress(ordered),
          isPaused: false,
        },
        isStarting: false,
        isAnalysing: false,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to start assessment'
      set({ error: msg, isStarting: false })
    }
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

  submitSession: async () => {
    const { session } = get()
    if (!session) return null
    set({ isAnalysing: true, error: null })
    try {
      // Reshape answers — strip questionId from the value (it's already the key)
      const payload = Object.fromEntries(
        Object.entries(session.answers).map(([qid, a]) => [
          qid,
          { answer: a.answer, responseTime: a.responseTime, skipped: a.skipped, isCorrect: a.isCorrect },
        ]),
      )
      const { resultId } = await assessmentApi.submit(session.assessmentId, { answers: payload })
      set({ resultId, isAnalysing: false })
      return resultId
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to submit assessment'
      set({ error: msg, isAnalysing: false })
      return null
    }
  },

  resetSession: () => set({ session: null, isAnalysing: false, resultId: null, error: null }),
}))
