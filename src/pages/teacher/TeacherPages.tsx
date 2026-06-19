import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users, Search, FileText, BarChart3, Download, BookOpen, TrendingUp, GraduationCap, Save,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, Badge, Progress } from '@/components/ui/primitives'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/primitives'
import { formatRelative, getDifficultyColor, cn } from '@/lib/utils'
import { gradeLabel, GRADES } from '@/lib/grades'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Label, Switch } from '@/components/ui/primitives'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import { teacherApi, queryKeys } from '@/api'
import { toast } from '@/components/ui/toast'

// ── Students ─────────────────────────────────────────────────────────────────
export function StudentsPage() {
  const { data: students = [], isLoading } = useQuery({
    queryKey: queryKeys.teacherStudents,
    queryFn: teacherApi.listStudents,
  })
  const { data: classInfo } = useQuery({
    queryKey: queryKeys.teacherClasses,
    queryFn: teacherApi.getClasses,
  })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all')
  const [classFilter, setClassFilter] = useState<string>('all')

  const myClasses = classInfo?.classes ?? []

  const filtered = students.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && s.riskLevel !== filter) return false
    if (classFilter !== 'all' && s.grade !== classFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
          <Users className="h-7 w-7 text-brand-500" /> My Students
        </h1>
        <p className="text-muted-foreground">View and manage your students' progress.</p>
        {myClasses.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-xs text-muted-foreground">Your classes:</span>
            {myClasses.map(c => (
              <Badge key={c.value} variant="secondary" className="text-xs">{c.label}</Badge>
            ))}
          </div>
        )}
        {classInfo && !classInfo.isAdmin && myClasses.length === 0 && (
          <p className="text-sm text-amber-600 mt-2">
            You have no classes assigned yet, so no students appear. Add your classes from your Profile page.
          </p>
        )}
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="pl-9" />
          </div>
          {myClasses.length > 1 && (
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
              className="h-9 rounded-full border border-border bg-background px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="all">All classes</option>
              {myClasses.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          )}
          {(['all', 'low', 'moderate', 'high'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
              {f === 'all' ? 'All' : `${f} risk`}
            </button>
          ))}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Last Activity</th>
                  <th className="px-4 py-3 font-medium">Assessments</th>
                  <th className="px-4 py-3 font-medium">Avg Score</th>
                  <th className="px-4 py-3 font-medium">Classification</th>
                  <th className="px-4 py-3 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size="sm" />
                        <div><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{s.gradeLabel || gradeLabel(s.grade) || '—'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatRelative(s.lastActivity)}</td>
                    <td className="px-4 py-3">{s.totalAssessments}</td>
                    <td className="px-4 py-3 font-semibold">{s.averageScore}%</td>
                    <td className="px-4 py-3">
                      {s.primaryDifficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(s.primaryDifficulty)}`}>
                          {s.primaryDifficulty.replace(/_/g, ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.riskLevel && <Badge variant={s.riskLevel === 'high' ? 'destructive' : s.riskLevel === 'moderate' ? 'warning' : 'success'} className="capitalize">{s.riskLevel}</Badge>}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No students match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── Analytics ────────────────────────────────────────────────────────────────
export function TeacherAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.teacherAnalytics,
    queryFn: teacherApi.analytics,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-brand-500" /> Classroom Analytics
        </h1>
        <p className="text-muted-foreground">Performance insights across your students.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Domain Averages</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data?.domainAverages || []} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="avg" fill="#3b91fd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Class Trend</CardTitle></CardHeader>
            <CardContent>
              {!data || data.classTrend.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12">Not enough data to plot a trend yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.classTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Line type="monotone" dataKey="overallScore" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ── Reports ──────────────────────────────────────────────────────────────────
export function ReportsPage() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: queryKeys.teacherReports,
    queryFn: teacherApi.reports,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
            <FileText className="h-7 w-7 text-brand-500" /> Reports
          </h1>
          <p className="text-muted-foreground">Generate and export detailed student reports.</p>
        </div>
        <Button variant="gradient" onClick={() => toast.info('Coming soon', 'Bulk PDF generation will be available shortly.')}>
          <Download className="h-4 w-4" /> Generate Report
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => toast.info('Preview', `Opening "${r.title}"…`)}>
                <CardContent className="p-5">
                  <FileText className="h-8 w-8 text-brand-500 mb-3" />
                  <p className="font-semibold mb-1">{r.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{r.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                    <Button variant="ghost" size="sm"><Download className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {reports.length === 0 && (
            <p className="col-span-full text-center py-8 text-muted-foreground">No reports yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Recommendations Engagement ───────────────────────────────────────────────
export function TeacherRecommendationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.teacherEngagement,
    queryFn: teacherApi.engagement,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-brand-500" /> Recommendations Overview
        </h1>
        <p className="text-muted-foreground">See which materials your students are engaging with.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Recommended', value: data?.totalAssigned ?? '—',     change: '+12%' },
          { label: 'Completion Rate',   value: data ? `${data.completionRate}%` : '—', change: '+5%' },
          { label: 'Avg Rating',        value: data?.averageRating ?? '—',     change: '+0.2' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-emerald-600 mt-1">{s.change} from last week</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Engagement by Student</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
          ) : (
            <div className="space-y-4">
              {(data?.students || []).map(s => (
                <div key={s.studentId} className="flex items-center gap-3">
                  <Avatar name={s.name} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground">{s.completed}/{s.total} completed</span>
                    </div>
                    <Progress value={s.progressPercent} className="h-1.5" />
                  </div>
                </div>
              ))}
              {(!data || data.students.length === 0) && <p className="text-center text-muted-foreground py-6">No engagement data yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Classroom (alias of analytics) ───────────────────────────────────────────
export function ClassroomPage() {
  const { data: stats } = useQuery({ queryKey: queryKeys.teacherClassroom, queryFn: teacherApi.classroomStats })
  const { data: students = [] } = useQuery({ queryKey: queryKeys.teacherStudents, queryFn: teacherApi.listStudents })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Classroom Overview</h1>
        <p className="text-muted-foreground">A high-level snapshot of your classroom.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Students</p><p className="font-display text-2xl font-bold mt-1">{stats?.totalStudents ?? '—'}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Assessed</p><p className="font-display text-2xl font-bold mt-1">{stats?.assessedStudents ?? '—'}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Average Score</p><p className="font-display text-2xl font-bold mt-1">{stats ? `${stats.averageScore}%` : '—'}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Improving</p><p className="font-display text-2xl font-bold mt-1">{students.filter(s => s.trend === 'improving').length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Student Snapshot</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.slice(0, 9).map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <Avatar name={s.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground">Avg {s.averageScore}% · {s.trend}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Teacher Profile ──────────────────────────────────────────────────────────
export function TeacherProfilePage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useUIStore()
  const qc = useQueryClient()
  const { data: classInfo } = useQuery({
    queryKey: queryKeys.teacherClasses,
    queryFn: teacherApi.getClasses,
  })
  const [selected, setSelected] = useState<string[] | null>(null)

  // Initialise the local selection from the server the first time it loads.
  const serverClasses = (classInfo?.classes ?? []).map(c => c.value)
  const current = selected ?? serverClasses
  const toggle = (value: string) =>
    setSelected(prev => {
      const base = prev ?? serverClasses
      return base.includes(value) ? base.filter(c => c !== value) : [...base, value]
    })

  const save = useMutation({
    mutationFn: () => teacherApi.setClasses(current),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.teacherClasses })
      qc.invalidateQueries({ queryKey: queryKeys.teacherStudents })
      qc.invalidateQueries({ queryKey: queryKeys.teacherClassroom })
      setSelected(null)
      toast.success('Classes updated', 'Your student lists now reflect these classes.')
    },
    onError: (e: Error) => toast.error('Could not save', e.message),
  })

  if (!user) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Profile</h1>
        <p className="text-muted-foreground">Manage your account preferences.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="xl" />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role} account</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {classInfo && !classInfo.isAdmin && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" /> My Classes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Select the classes you teach. Your student lists and analytics are scoped to these.</p>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map(g => (
                <button key={g.value} type="button" onClick={() => toggle(g.value)}
                  className={cn('py-2 rounded-lg border text-sm font-medium transition-all',
                    current.includes(g.value)
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                      : 'border-border hover:border-brand-300 text-muted-foreground')}>
                  {g.label}
                </button>
              ))}
            </div>
            <Button onClick={() => save.mutate()} variant="gradient" loading={save.isPending} disabled={current.length === 0}>
              <Save className="h-4 w-4" /> Save Classes
            </Button>
            {current.length === 0 && <p className="text-xs text-amber-600">Select at least one class.</p>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <Label className="mb-2 block">Theme</Label>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={cn('flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-all',
                  theme === t ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300' : 'border-border hover:border-brand-300')}>
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
