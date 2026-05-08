import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Clock, ChevronRight, ChevronLeft, SkipForward,
  Pause, CheckCircle, BookOpen, Zap, Target, BarChart3, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress, Badge } from '@/components/ui/primitives'
import { Card, CardContent } from '@/components/ui/card'
import { useAssessmentStore } from '@/store/assessmentStore'
import { formatDuration, getDomainColor, cn } from '@/lib/utils'
import type { AssessmentDomain } from '@/types'

// ─── Start Assessment Page ───────────────────────────────────────────────────
export function StartAssessmentPage() {
  const navigate = useNavigate()
  const { startSession } = useAssessmentStore()

  const domains = [
    { name: 'mathematics' as AssessmentDomain, icon: '∑', color: '#f59e0b', desc: '15 questions on arithmetic, numeracy, and problem solving' },
    { name: 'grammar' as AssessmentDomain, icon: 'Aa', color: '#8b5cf6', desc: '15 questions on sentence structure and language mechanics' },
    { name: 'reading' as AssessmentDomain, icon: '📖', color: '#3b82f6', desc: '15 questions on comprehension passages and inference' },
    { name: 'memory' as AssessmentDomain, icon: '🧠', color: '#14b8a6', desc: '15 tasks on short-term and working memory' },
    { name: 'reasoning' as AssessmentDomain, icon: '⚡', color: '#f43f5e', desc: '15 questions on logic, patterns, and abstract thinking' },
  ]

  const handleStart = () => {
    const id = 'session_' + Date.now()
    startSession(id)
    navigate('/student/assessment/live')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
            <Brain className="h-9 w-9 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Cognitive Assessment</h1>
          <p className="text-muted-foreground">Complete assessment across 5 domains. Takes approximately 30–45 minutes.</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">What to expect</h2>
            <div className="space-y-3">
              {domains.map(d => (
                <div key={d.name} className="flex items-start gap-3">
                  <span className="text-xl w-8 text-center shrink-0">{d.icon}</span>
                  <div>
                    <p className="font-medium capitalize">{d.name}</p>
                    <p className="text-sm text-muted-foreground">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-5">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1">Before you start</p>
            <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
              <li>Find a quiet place with no distractions</li>
              <li>Each question has a time limit — answer as quickly and accurately as you can</li>
              <li>You can skip questions, but try to answer all of them</li>
              <li>Do not refresh the page during the assessment</li>
            </ul>
          </CardContent>
        </Card>

        <Button onClick={handleStart} variant="gradient" size="xl" className="w-full group">
          Begin Assessment
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </div>
  )
}

// ─── Live Assessment Interface ───────────────────────────────────────────────
export function LiveAssessmentPage() {
  const navigate = useNavigate()
  const { session, answerQuestion, nextQuestion, previousQuestion, skipQuestion, pauseSession, resumeSession, submitSession, resetSession, isAnalysing } = useAssessmentStore()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const question = session?.questions[session.currentIndex]
  const totalQuestions = session?.questions.length || 0
  const currentIndex = session?.currentIndex || 0
  const answeredCount = Object.keys(session?.answers || {}).length

  // Init/reset timer when question changes
  useEffect(() => {
    if (!question) return
    const existingAnswer = session?.answers[question.id]
    setSelectedAnswer(existingAnswer?.answer || null)
    setTimeLeft(question.timeLimit)
    setQuestionStartTime(Date.now())
  }, [question?.id])

  // Countdown
  useEffect(() => {
    if (!question || session?.isPaused) return
    if (timeLeft <= 0) { handleNext(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, session?.isPaused])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    const responseTime = Date.now() - questionStartTime
    if (question) answerQuestion(question.id, answer, responseTime)
  }

  const handleNext = useCallback(() => {
    if (!question) return
    if (!session?.answers[question.id] && selectedAnswer) {
      answerQuestion(question.id, selectedAnswer, Date.now() - questionStartTime)
    }
    if (currentIndex === totalQuestions - 1) {
      setConfirmed(true)
    } else {
      setSelectedAnswer(null)
      nextQuestion()
    }
  }, [question, session, selectedAnswer, currentIndex, totalQuestions])

  const handleSubmit = async () => {
    submitSession()
    setTimeout(() => {
      navigate('/student/results')
    }, 3500)
  }

  if (!session) return <div className="text-center p-12"><p>No active session. <button onClick={() => navigate('/student/assessment')} className="text-brand-600 underline">Start assessment</button></p></div>

  if (isAnalysing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-20 w-20 rounded-full border-4 border-brand-500 border-t-transparent mx-auto mb-6" />
          <h2 className="font-display text-2xl font-bold mb-2">Analysing Your Results</h2>
          <p className="text-muted-foreground">Our AI is processing your responses across all five domains...</p>
          <div className="mt-6 space-y-2 text-left">
            {['Calculating domain scores...', 'Running classification model...', 'Generating recommendations...', 'Preparing your report...'].map((msg, i) => (
              <motion.div key={msg} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.7 }}
                className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> {msg}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-9 w-9 text-brand-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Submit Assessment?</h2>
          <p className="text-muted-foreground text-sm mb-2">You have answered {answeredCount} of {totalQuestions} questions.</p>
          <p className="text-muted-foreground text-sm mb-6">Once submitted, your answers cannot be changed.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmed(false)}>Review Answers</Button>
            <Button variant="gradient" className="flex-1" onClick={handleSubmit}>Submit Now</Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!question) return null

  const domainProgress = session.domainProgress
  const timerDanger = timeLeft <= 10
  const timerPct = (timeLeft / question.timeLimit) * 100

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Badge variant="info" className="capitalize">{question.domain}</Badge>
          <span className="text-sm text-muted-foreground">{currentIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-1.5 text-sm font-mono font-bold px-3 py-1.5 rounded-lg', timerDanger ? 'text-rose-600 bg-rose-50 dark:bg-rose-950 timer-danger' : 'text-foreground bg-muted')}>
            <Clock className={cn('h-4 w-4', timerDanger && 'text-rose-500')} />
            {formatDuration(timeLeft)}
          </div>
          <Button variant="outline" size="sm" onClick={() => { pauseSession(); setShowPauseModal(true) }}>
            <Pause className="h-4 w-4" /> Pause
          </Button>
        </div>
      </div>

      {/* Overall progress */}
      <Progress value={(answeredCount / totalQuestions) * 100} className="h-1.5 mb-6" />

      {/* Timer bar */}
      <div className="h-1 rounded-full bg-muted overflow-hidden mb-6">
        <motion.div className={cn('h-full rounded-full transition-colors', timerDanger ? 'bg-rose-500' : 'bg-brand-500')}
          initial={{ width: '100%' }} animate={{ width: `${timerPct}%` }} transition={{ duration: 1, ease: 'linear' }} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
          <Card className="mb-6">
            <CardContent className="p-8">
              {question.passage && (
                <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border text-sm leading-relaxed text-muted-foreground">
                  {question.passage}
                </div>
              )}
              <p className="font-display text-xl font-semibold mb-8 leading-relaxed">{question.text}</p>
              <div className="grid gap-3">
                {question.options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt
                  return (
                    <motion.button key={opt} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswer(opt)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
                        isSelected
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-medium'
                          : 'border-border hover:border-brand-300 hover:bg-accent'
                      )}>
                      <span className={cn('h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0',
                        isSelected ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground')}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isSelected && <CheckCircle className="h-5 w-5 text-brand-500 shrink-0" />}
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => { previousQuestion(); setSelectedAnswer(null) }} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { skipQuestion(); setSelectedAnswer(null) }}>
          <SkipForward className="h-4 w-4" /> Skip
        </Button>
        <Button variant={selectedAnswer ? 'gradient' : 'default'} onClick={handleNext} disabled={!selectedAnswer}>
          {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Pause modal */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
              <Pause className="h-12 w-12 text-brand-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Assessment Paused</h2>
              <p className="text-muted-foreground text-sm mb-6">Your progress is saved. Click resume when you're ready.</p>
              <Button variant="gradient" className="w-full" onClick={() => { resumeSession(); setShowPauseModal(false) }}>
                Resume Assessment
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
