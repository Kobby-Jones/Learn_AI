// ─── Auth & Users ──────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  grade?: string | null          // student's grade/class
  gradeLabel?: string | null
  classes?: string[]             // teacher's assigned classes (grade codes)
  classLabels?: string[]
  createdAt: string
  lastLogin?: string
  isActive: boolean
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  dyslexiaMode: boolean
  highContrast: boolean
  fontSize: 'sm' | 'md' | 'lg' | 'xl'
  reducedMotion: boolean
  notifications: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
  teacherCode?: string
  grade?: string          // required for students
  classes?: string[]      // optional for teachers
}

// ─── Assessment ────────────────────────────────────────────────────────────

export type AssessmentDomain = 'mathematics' | 'grammar' | 'reading' | 'memory' | 'reasoning'

export type QuestionType =
  | 'multiple_choice'
  | 'pattern_recognition'
  | 'sentence_correction'
  | 'reading_passage'
  | 'memory_recall'
  | 'sequence'

export interface Question {
  id: string
  domain: AssessmentDomain
  grade?: string
  gradeLabel?: string
  type: QuestionType
  text: string
  passage?: string
  options: string[]
  correctAnswer: string
  timeLimit: number // seconds
  difficulty: 'easy' | 'medium' | 'hard'
  imageUrl?: string
}

export interface StudentAnswer {
  questionId: string
  answer: string | null
  responseTime: number // ms
  isCorrect: boolean | null
  skipped: boolean
}

export interface Assessment {
  id: string
  studentId: string
  status: 'pending' | 'in_progress' | 'completed' | 'analysing'
  startedAt: string
  completedAt?: string
  answers: StudentAnswer[]
  currentDomain?: AssessmentDomain
  currentQuestionIndex?: number
}

export interface AssessmentSession {
  assessmentId: string
  questions: Question[]
  currentIndex: number
  answers: Record<string, StudentAnswer>
  startedAt: number
  domainProgress: Record<AssessmentDomain, { completed: number; total: number }>
  isPaused: boolean
}

// ─── Results & Classification ───────────────────────────────────────────────

export type DifficultyType =
  | 'dyslexia_related'
  | 'dyscalculia_related'
  | 'reading_comprehension'
  | 'memory_related'
  | 'reasoning_related'
  | 'no_significant_difficulty'

export interface DomainScore {
  domain: AssessmentDomain
  accuracy: number // 0-100
  avgResponseTime: number // ms
  correct: number
  total: number
  percentile: number
}

export interface ClassificationResult {
  primaryDifficulty: DifficultyType
  confidenceScore: number // 0-1
  riskLevel: 'low' | 'moderate' | 'high'
  domainScores: DomainScore[]
  strengths: AssessmentDomain[]
  weaknesses: AssessmentDomain[]
  summary: string
  detailedAnalysis: string
  recommendations: string[]
}

export interface AssessmentResult {
  id: string
  assessmentId: string
  studentId: string
  studentName: string
  completedAt: string
  classification: ClassificationResult
  overallScore: number
  timeSpent: number // seconds
}

// ─── Recommendations ───────────────────────────────────────────────────────

export type ContentFormat = 'video' | 'worksheet' | 'interactive' | 'article' | 'practice' | 'quiz'

export interface LearningMaterial {
  id: string
  title: string
  description: string
  domain: AssessmentDomain
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  format: ContentFormat
  estimatedDuration: number // minutes
  url: string
  thumbnailUrl?: string
  tags: string[]
  recommendationScore: number // 0-1
  isBookmarked?: boolean
  progressPercent: number
  rating?: number
  provider: string
}

export interface RecommendationSet {
  id: string
  studentId: string
  assessmentResultId: string
  generatedAt: string
  materials: LearningMaterial[]
  primaryFocus: AssessmentDomain
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export interface ProgressEntry {
  date: string
  overallScore: number
  mathematics: number
  grammar: number
  reading: number
  memory: number
  reasoning: number
}

export interface StudentStats {
  totalAssessments: number
  averageScore: number
  improvementRate: number
  streakDays: number
  materialsCompleted: number
  totalTimeSpent: number // minutes
  lastAssessmentDate?: string
}

export interface AdminStats {
  totalUsers: number
  activeStudents: number
  assessmentsToday: number
  assessmentsTotal: number
  difficultyDistribution: Record<DifficultyType, number>
  domainAverages: Record<AssessmentDomain, number>
  weeklyActivity: { day: string; count: number }[]
}

// ─── Notifications ──────────────────────────────────────────────────────────

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  link?: string
}

// ─── Teacher ────────────────────────────────────────────────────────────────

export interface StudentSummary {
  id: string
  name: string
  email: string
  avatar?: string
  grade?: string | null
  gradeLabel?: string | null
  lastActivity: string
  totalAssessments: number
  averageScore: number
  primaryDifficulty?: DifficultyType
  riskLevel?: 'low' | 'moderate' | 'high'
  trend: 'improving' | 'stable' | 'declining'
}

export interface ClassroomStats {
  totalStudents: number
  assessedStudents: number
  averageScore: number
  difficultyBreakdown: Record<DifficultyType, number>
  recentActivity: { studentName: string; action: string; time: string }[]
}
