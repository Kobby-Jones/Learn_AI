import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Brain, AlertCircle, CheckCircle, ArrowRight,
  Clock, Target, BarChart3, Download, Share2, Star,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress } from '@/components/ui/primitives'
import { getDomainColor, formatDuration } from '@/lib/utils'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { toast } from '@/components/ui/toast'
import { resultsApi, queryKeys } from '@/api'

const difficultyLabels: Record<string, string> = {
  dyslexia_related:           'Dyslexia-Related',
  dyscalculia_related:        'Dyscalculia-Related',
  reading_comprehension:      'Reading Comprehension Difficulty',
  memory_related:             'Memory-Related Difficulty',
  reasoning_related:          'Reasoning-Related Difficulty',
  no_significant_difficulty:  'No Significant Difficulty Detected',
}

const riskColors: Record<string, string> = {
  low:      'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
  moderate: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
  high:     'text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-400',
}

export default function ResultsPage() {
  const { data: result, isLoading, isError } = useQuery({
    queryKey: queryKeys.resultLatest,
    queryFn: resultsApi.latest,
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-muted-foreground mt-4 text-sm">Loading your results…</p>
      </div>
    )
  }

  if (isError || !result) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">No results yet</h2>
        <p className="text-muted-foreground mb-6">Take your first assessment to see your cognitive profile and personalised recommendations.</p>
        <Link to="/student/assessment">
          <Button variant="gradient">Start Assessment <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    )
  }

  const { classification } = result

  const radarData = classification.domainScores.map(d => ({
    domain: d.domain.charAt(0).toUpperCase() + d.domain.slice(1),
    score:  d.accuracy,
    fullMark: 100,
  }))

  const barData = classification.domainScores.map(d => ({
    domain:  d.domain.charAt(0).toUpperCase() + d.domain.slice(1),
    score:   d.accuracy,
    avgTime: Math.round(d.avgResponseTime / 1000),
  }))

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Assessment Report</h1>
          <p className="text-muted-foreground text-sm">
            Completed {new Date(result.completedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Export feature', 'PDF export coming soon')}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info('Share feature', 'Sharing with teacher…')}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-500 to-teal-500" />
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-display font-bold text-3xl shrink-0">
                {result.overallScore}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-display text-xl font-bold">
                    {difficultyLabels[classification.primaryDifficulty] || classification.primaryDifficulty}
                  </h2>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${riskColors[classification.riskLevel]}`}>
                    {classification.riskLevel} risk
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{classification.summary}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Target className="h-4 w-4" /> Confidence: {Math.round(classification.confidenceScore * 100)}%</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Time: {formatDuration(result.timeSpent)}</span>
                  <span className="flex items-center gap-1"><BarChart3 className="h-4 w-4" /> {classification.domainScores.reduce((a, d) => a + d.correct, 0)} / {classification.domainScores.reduce((a, d) => a + d.total, 0)} correct</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-brand-500" /> Cognitive Profile</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12 }} />
                  <Radar name="Score" dataKey="score" stroke="#3b91fd" fill="#3b91fd" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-teal-500" /> Domain Accuracy</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={getDomainColor(entry.domain.toLowerCase())} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader><CardTitle>Domain Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classification.domainScores.map(d => (
                <div key={d.domain} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-medium capitalize">{d.domain}</span>
                      {classification.strengths.includes(d.domain) && <Badge variant="success" className="text-[10px]">Strength</Badge>}
                      {classification.weaknesses.includes(d.domain) && <Badge variant="warning" className="text-[10px]">Focus area</Badge>}
                    </div>
                    <Progress value={d.accuracy} className="h-2" />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{d.accuracy}%</span>
                  <span className="text-xs text-muted-foreground w-16 text-right">{d.correct}/{d.total} correct</span>
                  <span className="text-xs text-muted-foreground w-16 text-right">{Math.round(d.avgResponseTime / 1000)}s avg</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-violet-500" /> Detailed Analysis</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{classification.detailedAnalysis}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Strengths
                </p>
                {classification.strengths.length === 0 && <p className="text-xs italic text-emerald-700 dark:text-emerald-400">None identified yet — keep practising!</p>}
                {classification.strengths.map(s => (
                  <div key={s} className="text-sm text-emerald-700 dark:text-emerald-400 capitalize flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {s}
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> Recommended Focus Areas
                </p>
                {classification.weaknesses.length === 0 && <p className="text-xs italic text-amber-700 dark:text-amber-400">No critical focus areas detected.</p>}
                {classification.weaknesses.map(w => (
                  <div key={w} className="text-sm text-amber-700 dark:text-amber-400 capitalize flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {w}
                  </div>
                ))}
              </div>
            </div>

            {classification.recommendations.length > 0 && (
              <div className="mt-5 rounded-xl border border-brand-100 dark:border-brand-900 bg-brand-50/40 dark:bg-brand-950/20 p-4">
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-2">Suggested Next Steps</p>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                  {classification.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="bg-gradient-to-r from-brand-50 to-teal-50 dark:from-brand-950/30 dark:to-teal-950/30 border-brand-100 dark:border-brand-800">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display font-semibold mb-1">Ready to start improving?</p>
              <p className="text-sm text-muted-foreground">We've prepared personalized materials based on your results.</p>
            </div>
            <Link to="/student/recommendations">
              <Button variant="gradient" className="shrink-0 group">
                <Star className="h-4 w-4" /> View Recommendations
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
