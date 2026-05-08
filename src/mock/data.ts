import type {
  User, AssessmentResult, LearningMaterial, ProgressEntry,
  AdminStats, StudentSummary, Question, Notification, ClassroomStats
} from '@/types'

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@student.edu',
  role: 'student',
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: new Date().toISOString(),
  isActive: true,
  preferences: {
    theme: 'light',
    dyslexiaMode: false,
    highContrast: false,
    fontSize: 'md',
    reducedMotion: false,
    notifications: true,
  },
}

export const mockTeacher: User = {
  id: 'u2',
  name: 'Ms. Sarah Williams',
  email: 'swilliams@school.edu',
  role: 'teacher',
  createdAt: '2023-09-01T10:00:00Z',
  lastLogin: new Date().toISOString(),
  isActive: true,
  preferences: {
    theme: 'light',
    dyslexiaMode: false,
    highContrast: false,
    fontSize: 'md',
    reducedMotion: false,
    notifications: true,
  },
}

export const mockAdmin: User = {
  id: 'u3',
  name: 'Dr. Michael Chen',
  email: 'admin@learnai.edu',
  role: 'admin',
  createdAt: '2023-01-01T10:00:00Z',
  lastLogin: new Date().toISOString(),
  isActive: true,
  preferences: {
    theme: 'dark',
    dyslexiaMode: false,
    highContrast: false,
    fontSize: 'md',
    reducedMotion: false,
    notifications: true,
  },
}

export const mockQuestions: Question[] = [
  // Mathematics
  {
    id: 'q1', domain: 'mathematics', type: 'multiple_choice',
    text: 'What is 247 + 358?',
    options: ['595', '605', '615', '585'],
    correctAnswer: '605', timeLimit: 45, difficulty: 'easy',
  },
  {
    id: 'q2', domain: 'mathematics', type: 'multiple_choice',
    text: 'If a bag has 24 apples and you give away ⅓ of them, how many are left?',
    options: ['8', '16', '12', '18'],
    correctAnswer: '16', timeLimit: 60, difficulty: 'medium',
  },
  {
    id: 'q3', domain: 'mathematics', type: 'pattern_recognition',
    text: 'What number comes next in the sequence: 3, 6, 12, 24, __?',
    options: ['36', '48', '30', '42'],
    correctAnswer: '48', timeLimit: 45, difficulty: 'medium',
  },
  // Grammar
  {
    id: 'q4', domain: 'grammar', type: 'sentence_correction',
    text: 'Which sentence is grammatically correct?',
    options: [
      'She dont like ice cream.',
      'She doesn\'t likes ice cream.',
      'She doesn\'t like ice cream.',
      'She do not likes ice cream.',
    ],
    correctAnswer: 'She doesn\'t like ice cream.', timeLimit: 40, difficulty: 'easy',
  },
  {
    id: 'q5', domain: 'grammar', type: 'multiple_choice',
    text: 'Choose the correct word: The team __ working hard to win the championship.',
    options: ['is', 'are', 'were', 'be'],
    correctAnswer: 'is', timeLimit: 40, difficulty: 'medium',
  },
  // Reading
  {
    id: 'q6', domain: 'reading', type: 'reading_passage',
    passage: 'The Amazon rainforest, often called the "lungs of the Earth," produces 20% of the world\'s oxygen. It spans across nine countries in South America and is home to millions of species of plants and animals. Scientists estimate that a new species is discovered in the Amazon every three days.',
    text: 'According to the passage, what percentage of the world\'s oxygen does the Amazon produce?',
    options: ['10%', '15%', '20%', '25%'],
    correctAnswer: '20%', timeLimit: 90, difficulty: 'easy',
  },
  {
    id: 'q7', domain: 'reading', type: 'reading_passage',
    passage: 'Maria had always loved the ocean. Every morning she would walk to the cliff overlooking the bay, watching the fishing boats return with their catch. Her grandmother had been a lighthouse keeper, and Maria often dreamed of continuing that tradition, though the old lighthouse had been automated years ago.',
    text: 'What can we infer about Maria\'s connection to the sea?',
    options: [
      'She works as a fisherman.',
      'She has a family history tied to the ocean.',
      'She is afraid of the water.',
      'She recently moved to the coast.',
    ],
    correctAnswer: 'She has a family history tied to the ocean.', timeLimit: 90, difficulty: 'medium',
  },
  // Memory
  {
    id: 'q8', domain: 'memory', type: 'memory_recall',
    text: 'Remember this sequence: 7, 3, 9, 1, 5. Now select the correct sequence:',
    options: ['7, 3, 9, 1, 5', '7, 9, 3, 1, 5', '3, 7, 9, 1, 5', '7, 3, 9, 5, 1'],
    correctAnswer: '7, 3, 9, 1, 5', timeLimit: 30, difficulty: 'easy',
  },
  {
    id: 'q9', domain: 'memory', type: 'memory_recall',
    text: 'Remember these words: APPLE, RIVER, CLOCK, GARDEN, MUSIC. Which word was third?',
    options: ['APPLE', 'RIVER', 'CLOCK', 'GARDEN'],
    correctAnswer: 'CLOCK', timeLimit: 25, difficulty: 'easy',
  },
  // Reasoning
  {
    id: 'q10', domain: 'reasoning', type: 'pattern_recognition',
    text: 'If all Bloops are Razzies, and all Razzies are Lazzies, then all Bloops are definitely:',
    options: ['Razzies only', 'Lazzies', 'Neither Razzies nor Lazzies', 'Not Lazzies'],
    correctAnswer: 'Lazzies', timeLimit: 60, difficulty: 'medium',
  },
  {
    id: 'q11', domain: 'reasoning', type: 'multiple_choice',
    text: 'What comes next in the pattern: ▲ ■ ● ▲ ■ ● ▲ __',
    options: ['▲', '■', '●', '▼'],
    correctAnswer: '■', timeLimit: 30, difficulty: 'easy',
  },
  {
    id: 'q12', domain: 'reasoning', type: 'multiple_choice',
    text: 'Book is to Reading as Fork is to:',
    options: ['Kitchen', 'Eating', 'Metal', 'Sharp'],
    correctAnswer: 'Eating', timeLimit: 45, difficulty: 'easy',
  },
]

export const mockAssessmentResult: AssessmentResult = {
  id: 'ar1',
  assessmentId: 'a1',
  studentId: 'u1',
  studentName: 'Alex Johnson',
  completedAt: new Date(Date.now() - 86400000).toISOString(),
  overallScore: 72,
  timeSpent: 1847,
  classification: {
    primaryDifficulty: 'reading_comprehension',
    confidenceScore: 0.78,
    riskLevel: 'moderate',
    domainScores: [
      { domain: 'mathematics', accuracy: 85, avgResponseTime: 18200, correct: 13, total: 15, percentile: 72 },
      { domain: 'grammar', accuracy: 80, avgResponseTime: 15400, correct: 12, total: 15, percentile: 65 },
      { domain: 'reading', accuracy: 53, avgResponseTime: 42100, correct: 8, total: 15, percentile: 28 },
      { domain: 'memory', accuracy: 73, avgResponseTime: 12000, correct: 11, total: 15, percentile: 58 },
      { domain: 'reasoning', accuracy: 67, avgResponseTime: 28700, correct: 10, total: 15, percentile: 45 },
    ],
    strengths: ['mathematics', 'grammar'],
    weaknesses: ['reading', 'reasoning'],
    summary: 'Alex shows strong mathematical and grammatical foundations. Reading comprehension scores indicate potential difficulty with inferential understanding and longer text processing.',
    detailedAnalysis: 'Assessment results indicate above-average performance in mathematics (85%) and grammar (80%), suggesting strong foundational language mechanics and numerical reasoning. Reading comprehension performance (53%) is notably below domain average, with extended response times on passage-based questions suggesting difficulty processing and retaining information from longer texts. This pattern is consistent with indicators associated with reading comprehension difficulty.',
    recommendations: [
      'Focus on reading comprehension strategies such as summarizing and questioning',
      'Practice with shorter texts and gradually increase length',
      'Use graphic organizers to support text comprehension',
    ],
  },
}

export const mockRecommendations: LearningMaterial[] = [
  {
    id: 'm1', title: 'Reading Comprehension Strategies for Middle School',
    description: 'Learn powerful strategies to understand and retain what you read, including summarizing, questioning, and visualizing.',
    domain: 'reading', difficultyLevel: 'intermediate', format: 'video',
    estimatedDuration: 18, url: '#', thumbnailUrl: 'https://picsum.photos/seed/read1/400/225',
    tags: ['comprehension', 'strategies', 'inference'],
    recommendationScore: 0.95, isBookmarked: false, progressPercent: 0,
    rating: 4.8, provider: 'Khan Academy',
  },
  {
    id: 'm2', title: 'Inference Skills: Reading Between the Lines',
    description: 'Interactive exercises to help you draw conclusions from text and understand implied meaning.',
    domain: 'reading', difficultyLevel: 'intermediate', format: 'interactive',
    estimatedDuration: 25, url: '#', thumbnailUrl: 'https://picsum.photos/seed/read2/400/225',
    tags: ['inference', 'critical thinking', 'reading'],
    recommendationScore: 0.91, isBookmarked: true, progressPercent: 30,
    rating: 4.6, provider: 'ReadWorks',
  },
  {
    id: 'm3', title: 'Vocabulary Builder Worksheet Pack',
    description: 'Printable worksheets to expand your vocabulary and improve reading fluency.',
    domain: 'reading', difficultyLevel: 'beginner', format: 'worksheet',
    estimatedDuration: 30, url: '#', thumbnailUrl: 'https://picsum.photos/seed/read3/400/225',
    tags: ['vocabulary', 'fluency', 'reading'],
    recommendationScore: 0.87, isBookmarked: false, progressPercent: 0,
    rating: 4.3, provider: 'Education.com',
  },
  {
    id: 'm4', title: 'Logical Reasoning Puzzles',
    description: 'Develop critical thinking through progressively challenging logic puzzles and brainteasers.',
    domain: 'reasoning', difficultyLevel: 'intermediate', format: 'interactive',
    estimatedDuration: 20, url: '#', thumbnailUrl: 'https://picsum.photos/seed/reason1/400/225',
    tags: ['logic', 'puzzles', 'reasoning'],
    recommendationScore: 0.82, isBookmarked: false, progressPercent: 15,
    rating: 4.7, provider: 'BrainPOP',
  },
  {
    id: 'm5', title: 'Pattern Recognition Mastery',
    description: 'Visual and numerical pattern exercises to strengthen abstract reasoning skills.',
    domain: 'reasoning', difficultyLevel: 'beginner', format: 'practice',
    estimatedDuration: 15, url: '#', thumbnailUrl: 'https://picsum.photos/seed/reason2/400/225',
    tags: ['patterns', 'visual', 'abstract'],
    recommendationScore: 0.79, isBookmarked: false, progressPercent: 0,
    rating: 4.4, provider: 'IXL Learning',
  },
  {
    id: 'm6', title: 'Memory Training Techniques',
    description: 'Science-backed techniques to improve working memory and information retention.',
    domain: 'memory', difficultyLevel: 'beginner', format: 'article',
    estimatedDuration: 10, url: '#', thumbnailUrl: 'https://picsum.photos/seed/mem1/400/225',
    tags: ['memory', 'mnemonics', 'retention'],
    recommendationScore: 0.74, isBookmarked: false, progressPercent: 60,
    rating: 4.2, provider: 'Understood.org',
  },
]

export const mockProgressData: ProgressEntry[] = [
  { date: '2024-01-01', overallScore: 58, mathematics: 70, grammar: 65, reading: 42, memory: 55, reasoning: 58 },
  { date: '2024-01-08', overallScore: 61, mathematics: 72, grammar: 67, reading: 45, memory: 58, reasoning: 61 },
  { date: '2024-01-15', overallScore: 63, mathematics: 75, grammar: 70, reading: 47, memory: 60, reasoning: 63 },
  { date: '2024-01-22', overallScore: 66, mathematics: 78, grammar: 72, reading: 50, memory: 63, reasoning: 65 },
  { date: '2024-01-29', overallScore: 68, mathematics: 80, grammar: 74, reading: 51, memory: 65, reasoning: 66 },
  { date: '2024-02-05', overallScore: 70, mathematics: 82, grammar: 76, reading: 52, memory: 67, reasoning: 67 },
  { date: '2024-02-12', overallScore: 72, mathematics: 85, grammar: 80, reading: 53, memory: 73, reasoning: 67 },
]

export const mockAdminStats: AdminStats = {
  totalUsers: 1247,
  activeStudents: 834,
  assessmentsToday: 47,
  assessmentsTotal: 3891,
  difficultyDistribution: {
    dyslexia_related: 142,
    dyscalculia_related: 98,
    reading_comprehension: 217,
    memory_related: 176,
    reasoning_related: 134,
    no_significant_difficulty: 480,
  },
  domainAverages: {
    mathematics: 71,
    grammar: 68,
    reading: 59,
    memory: 64,
    reasoning: 66,
  },
  weeklyActivity: [
    { day: 'Mon', count: 42 },
    { day: 'Tue', count: 58 },
    { day: 'Wed', count: 65 },
    { day: 'Thu', count: 71 },
    { day: 'Fri', count: 53 },
    { day: 'Sat', count: 28 },
    { day: 'Sun', count: 19 },
  ],
}

export const mockStudents: StudentSummary[] = [
  {
    id: 'u1', name: 'Alex Johnson', email: 'alex@student.edu',
    lastActivity: new Date(Date.now() - 3600000).toISOString(),
    totalAssessments: 3, averageScore: 72,
    primaryDifficulty: 'reading_comprehension', riskLevel: 'moderate', trend: 'improving',
  },
  {
    id: 'u4', name: 'Priya Patel', email: 'priya@student.edu',
    lastActivity: new Date(Date.now() - 7200000).toISOString(),
    totalAssessments: 5, averageScore: 81,
    primaryDifficulty: 'no_significant_difficulty', riskLevel: 'low', trend: 'stable',
  },
  {
    id: 'u5', name: 'James Osei', email: 'josei@student.edu',
    lastActivity: new Date(Date.now() - 86400000).toISOString(),
    totalAssessments: 2, averageScore: 58,
    primaryDifficulty: 'dyscalculia_related', riskLevel: 'high', trend: 'declining',
  },
  {
    id: 'u6', name: 'Emma Clarke', email: 'emma@student.edu',
    lastActivity: new Date(Date.now() - 172800000).toISOString(),
    totalAssessments: 4, averageScore: 75,
    primaryDifficulty: 'memory_related', riskLevel: 'moderate', trend: 'improving',
  },
  {
    id: 'u7', name: 'Luca Ferrari', email: 'luca@student.edu',
    lastActivity: new Date(Date.now() - 259200000).toISOString(),
    totalAssessments: 1, averageScore: 64,
    primaryDifficulty: 'dyslexia_related', riskLevel: 'moderate', trend: 'stable',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'n1', title: 'Assessment Complete',
    message: 'Your latest assessment has been analysed. View your results now.',
    type: 'success', isRead: false, createdAt: new Date(Date.now() - 1800000).toISOString(),
    link: '/student/results',
  },
  {
    id: 'n2', title: 'New Recommendations',
    message: '6 new learning materials have been recommended for you.',
    type: 'info', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: '/student/recommendations',
  },
  {
    id: 'n3', title: 'Weekly Progress Report',
    message: 'Your reading score improved by 3 points this week!',
    type: 'success', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const mockClassroomStats: ClassroomStats = {
  totalStudents: 28,
  assessedStudents: 21,
  averageScore: 68,
  difficultyBreakdown: {
    dyslexia_related: 3,
    dyscalculia_related: 2,
    reading_comprehension: 5,
    memory_related: 4,
    reasoning_related: 3,
    no_significant_difficulty: 11,
  },
  recentActivity: [
    { studentName: 'Alex Johnson', action: 'Completed assessment', time: '1 hour ago' },
    { studentName: 'Priya Patel', action: 'Finished 2 recommended materials', time: '2 hours ago' },
    { studentName: 'James Osei', action: 'Started assessment', time: '3 hours ago' },
    { studentName: 'Emma Clarke', action: 'Bookmarked 3 materials', time: '5 hours ago' },
  ],
}
