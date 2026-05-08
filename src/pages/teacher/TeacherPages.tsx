import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'
import {
  Users, Search, Filter, Eye, Download, BarChart3,
  TrendingUp, BookOpen, GraduationCap, Settings, FileText,
  AlertCircle, CheckCircle, ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Avatar, Progress, Skeleton } from '@/components/ui/primitives'
import { mockStudents, mockClassroomStats, mockProgressData } from '@/mock/data'
import { getDifficultyColor, formatRelative, cn, capitalize } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line
} from 'recharts'
import { toast } from '@/components/ui/toast'
import type { StudentSummary } from '@/types'

const riskColors: Record<string, string> = {
  low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
  moderate: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
  high: 'text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-400',
}

// ─── Students Page ──────────────────────────────────────────────────────────
export function StudentsPage() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  const filtered = mockStudents.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (riskFilter !== 'all' && s.riskLevel !== riskFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div><h1 className="font-display text-3xl font-bold mb-1">My Students</h1>
          <p className="text-muted-foreground">{mockStudents.length} students enrolled</p></div>
        <Button variant="outline" onClick={() => toast.info('Export', 'Generating CSV report...')}><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {['all', 'low', 'moderate', 'high'].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize', riskFilter === r ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
              {r} risk
            </button>
          ))}
        </CardContent>
      </Card>
      <div className="space-y-3">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar name={s.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{s.name}</p>
                    {s.riskLevel && <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', riskColors[s.riskLevel])}>{s.riskLevel} risk</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last active: {formatRelative(s.lastActivity)} • {s.totalAssessments} assessments • Avg: {s.averageScore}%</p>
                </div>
                <div className="text-right shrink-0">
                  {s.primaryDifficulty && (
                    <div className={cn('text-xs px-2 py-0.5 rounded-full font-medium mb-2', getDifficultyColor(s.primaryDifficulty))}>
                      {s.primaryDifficulty.replace(/_/g, ' ')}
                    </div>
                  )}
                  <Button size="sm" variant="outline"><Eye className="h-3 w-3" /> View Profile</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Analytics Page ─────────────────────────────────────────────────────────
export function TeacherAnalyticsPage() {
  const domainData = [
    { domain: 'Math', avg: 71 }, { domain: 'Grammar', avg: 68 }, { domain: 'Reading', avg: 59 },
    { domain: 'Memory', avg: 64 }, { domain: 'Reasoning', avg: 66 },
  ]
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold mb-1">Class Analytics</h1>
        <p className="text-muted-foreground">Performance insights across your classroom.</p></div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-brand-500" />Domain Averages</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="avg" fill="#3b91fd" radius={[4, 4, 0, 0]} name="Class Average" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-teal-500" />Progress Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="overallScore" stroke="#14b8a6" strokeWidth={2} dot={false} name="Class Avg" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Student Performance Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Avg Score</th>
                <th className="pb-3 font-medium">Assessments</th>
                <th className="pb-3 font-medium">Risk Level</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr></thead>
              <tbody>
                {mockStudents.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 flex items-center gap-2"><Avatar name={s.name} size="sm" />{s.name}</td>
                    <td className="py-3 font-semibold">{s.averageScore}%</td>
                    <td className="py-3 text-muted-foreground">{s.totalAssessments}</td>
                    <td className="py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', s.riskLevel ? riskColors[s.riskLevel] : '')}>{s.riskLevel || '—'}</span></td>
                    <td className={cn('py-3 text-sm capitalize', s.trend === 'improving' ? 'text-emerald-500' : s.trend === 'declining' ? 'text-rose-500' : 'text-muted-foreground')}>{s.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Reports Page ────────────────────────────────────────────────────────────
export function ReportsPage() {
  const reports = [
    { title: 'Weekly Class Summary', desc: 'Overview of all student activity this week', date: '2024-02-12', type: 'summary' },
    { title: 'Alex Johnson — Assessment Report', desc: 'Detailed reading comprehension difficulty report', date: '2024-02-11', type: 'individual' },
    { title: 'Risk Assessment Report', desc: 'Students flagged as moderate or high risk', date: '2024-02-10', type: 'risk' },
    { title: 'Monthly Progress Report', desc: 'Classroom progress over the past 30 days', date: '2024-02-05', type: 'progress' },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div><h1 className="font-display text-3xl font-bold mb-1">Reports</h1>
          <p className="text-muted-foreground">Generated reports for your classroom.</p></div>
        <Button variant="gradient" onClick={() => toast.success('Report generated', 'New weekly summary ready')}><FileText className="h-4 w-4" /> Generate New</Button>
      </div>
      <div className="space-y-3">
        {reports.map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-500 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.date}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => toast.info('Download', 'PDF downloading...')}><Download className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline"><Eye className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Teacher Recommendations Page ──────────────────────────────────────────
export function TeacherRecommendationsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold mb-1">Recommendation Oversight</h1>
        <p className="text-muted-foreground">Monitor which materials your students are engaging with.</p></div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Assigned', value: '48', icon: '📚' },
          { label: 'Completion Rate', value: '62%', icon: '✅' },
          { label: 'Avg Rating', value: '4.3⭐', icon: '⭐' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-5 flex items-center gap-3">
            <span className="text-3xl">{s.icon}</span>
            <div><p className="font-bold text-2xl">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Student Material Engagement</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStudents.map(s => (
              <div key={s.id} className="flex items-center gap-4">
                <Avatar name={s.name} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground">{Math.floor(Math.random() * 5 + 2)} / 8 materials</span>
                  </div>
                  <Progress value={Math.floor(Math.random() * 70 + 20)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Classroom Stats Page ───────────────────────────────────────────────────
export function ClassroomPage() {
  const stats = mockClassroomStats
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold mb-1">Classroom Statistics</h1>
        <p className="text-muted-foreground">Aggregate view of your classroom performance.</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Students', value: stats.totalStudents },
          { label: 'Assessed', value: stats.assessedStudents },
          { label: 'Avg Score', value: `${stats.averageScore}%` },
          { label: 'Response Rate', value: `${Math.round(stats.assessedStudents / stats.totalStudents * 100)}%` },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-5 text-center">
            <p className="font-display text-3xl font-bold gradient-text">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Difficulty Breakdown</CardTitle></CardHeader>
        <CardContent>
          {Object.entries(stats.difficultyBreakdown).map(([key, val]) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-muted-foreground">{val} students</span>
              </div>
              <Progress value={(val / stats.totalStudents) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Teacher Profile ─────────────────────────────────────────────────────────
export function TeacherProfilePage() {
  const { user } = useAuthStore()
  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="font-display text-3xl font-bold mb-1">Profile</h1></div>
      <Card><CardContent className="p-6 text-center">
        <Avatar name={user?.name || 'Teacher'} size="xl" className="mx-auto mb-4" />
        <p className="font-display text-xl font-bold">{user?.name}</p>
        <p className="text-muted-foreground">{user?.email}</p>
        <Badge variant="info" className="mt-2 capitalize">{user?.role}</Badge>
      </CardContent></Card>
    </div>
  )
}
