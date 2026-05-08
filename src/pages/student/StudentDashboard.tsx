import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, TrendingUp, Star, Clock, ArrowRight, BookOpen,
  BarChart3, Flame, Target, CheckCircle, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress, Badge, Avatar } from '@/components/ui/primitives'
import { useAuthStore } from '@/store/authStore'
import { mockAssessmentResult, mockRecommendations, mockProgressData } from '@/mock/data'
import { getDifficultyColor, getDomainColor, formatRelative, formatDuration } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const result = mockAssessmentResult
  const recs = mockRecommendations.slice(0, 3)
  const firstName = user?.name.split(' ')[0] || 'Student'

  const domainScores = result.classification.domainScores

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's your learning overview for today.</p>
        </div>
        <Link to="/student/assessment">
          <Button variant="gradient" size="lg" className="group">
            <Brain className="h-4 w-4" />
            Start Assessment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: `${result.overallScore}%`, icon: <Target className="h-5 w-5" />, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-950' },
          { label: 'Assessments', value: '3', icon: <BarChart3 className="h-5 w-5" />, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950' },
          { label: 'Materials Done', value: '12', icon: <BookOpen className="h-5 w-5" />, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950' },
          { label: 'Study Streak', value: '7 days', icon: <Flame className="h-5 w-5" />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} custom={i + 1} initial="hidden" animate="show">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress chart */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-500" /> Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mockProgressData}>
                  <defs>
                    {[['brand', '#3b91fd'], ['teal', '#14b8a6']].map(([id, c]) => (
                      <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} domain={[40, 100]} />
                  <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="overallScore" stroke="#3b91fd" fill="url(#grad-brand)" strokeWidth={2} name="Overall" />
                  <Area type="monotone" dataKey="reading" stroke="#14b8a6" fill="url(#grad-teal)" strokeWidth={2} name="Reading" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Domain scores */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Domain Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {domainScores.map(d => (
                <div key={d.domain}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="capitalize font-medium">{d.domain}</span>
                    <span className="text-muted-foreground">{d.accuracy}%</span>
                  </div>
                  <Progress value={d.accuracy} color={`bg-[${getDomainColor(d.domain)}]`}
                    className="h-2" style={{ '--progress-color': getDomainColor(d.domain) } as React.CSSProperties} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Latest result + recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Latest result */}
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="show">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-500" /> Latest Assessment
                </CardTitle>
                <Link to="/student/results" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  View full <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-display font-bold text-xl">
                  {result.overallScore}
                </div>
                <div>
                  <p className="font-medium">Overall Score</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(result.classification.primaryDifficulty)}`}>
                    {result.classification.primaryDifficulty.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.classification.summary}</p>
              <div className="flex gap-2 mt-4">
                <div className="flex-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Strengths</p>
                  {result.classification.strengths.map(s => (
                    <div key={s} className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" /> {s}
                    </div>
                  ))}
                </div>
                <div className="flex-1 rounded-lg bg-rose-50 dark:bg-rose-950 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Focus Areas</p>
                  {result.classification.weaknesses.map(w => (
                    <div key={w} className="flex items-center gap-1 text-xs font-medium text-rose-700 dark:text-rose-400">
                      <AlertCircle className="h-3 w-3" /> {w}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top recommendations */}
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="show">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" /> Recommended For You
                </CardTitle>
                <Link to="/student/recommendations" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  See all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recs.map(r => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-950 flex items-center justify-center shrink-0">
                    {r.format === 'video' ? '🎬' : r.format === 'interactive' ? '⚡' : r.format === 'worksheet' ? '📄' : '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{r.domain}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />{r.estimatedDuration}m
                      </span>
                    </div>
                    {r.progressPercent > 0 && (
                      <Progress value={r.progressPercent} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
