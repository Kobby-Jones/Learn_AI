import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users, Brain, TrendingUp, Activity, FileText, Settings, Shield, Database,
  AlertCircle, CheckCircle, Server, Search, MoreVertical, UserCheck, UserX, Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, Badge, Input, Label, Switch } from '@/components/ui/primitives'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { formatRelative, cn } from '@/lib/utils'
import { GRADES, gradeLabel } from '@/lib/grades'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line,
} from 'recharts'
import { adminApi, queryKeys } from '@/api'
import { toast } from '@/components/ui/toast'

const COLORS = ['#f43f5e', '#f59e0b', '#3b82f6', '#14b8a6', '#8b5cf6', '#10b981']

// ── Admin Dashboard ──────────────────────────────────────────────────────────
export function AdminDashboard() {
  const statsQ = useQuery({ queryKey: queryKeys.adminStats,     queryFn: adminApi.stats })
  const sysQ   = useQuery({ queryKey: queryKeys.adminSystem,    queryFn: adminApi.system })
  const stats  = statsQ.data
  const system = sysQ.data

  const difficultyData = stats ? Object.entries(stats.difficultyDistribution)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k.replace(/_/g, ' '), value: v })) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and system health.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',     value: stats?.totalUsers ?? '—',         icon: <Users className="h-5 w-5" />,    color: 'brand'   },
          { label: 'Active Students', value: stats?.activeStudents ?? '—',     icon: <UserCheck className="h-5 w-5" />, color: 'teal'   },
          { label: 'Assessments Today', value: stats?.assessmentsToday ?? '—', icon: <Brain className="h-5 w-5" />,    color: 'violet'  },
          { label: 'Total Assessments', value: stats?.assessmentsTotal ?? '—', icon: <Activity className="h-5 w-5" />, color: 'emerald' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card><CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl bg-${s.color}-100 dark:bg-${s.color}-950 text-${s.color}-600 flex items-center justify-center`}>{s.icon}</div>
              </div>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-brand-500" />Weekly Assessment Activity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats?.weeklyActivity || []}>
                <defs>
                  <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b91fd" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b91fd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b91fd" fill="url(#weekGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-violet-500" />Difficulty Distribution</CardTitle></CardHeader>
          <CardContent>
            {difficultyData.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-10">No assessments yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={difficultyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {difficultyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-emerald-500" />System Health</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(system?.services || []).map(s => (
              <div key={s.name} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  {s.status === 'online' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-rose-500" />}
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <p className="text-xs text-muted-foreground capitalize">{s.status} · {s.ping}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Users Page ───────────────────────────────────────────────────────────────
export function UsersPage() {
  const qc = useQueryClient()
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { data: users = [], isLoading } = useQuery({
    queryKey: queryKeys.adminUsers(roleFilter),
    queryFn: () => adminApi.listUsers(roleFilter === 'all' ? undefined : roleFilter),
  })

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => adminApi.updateUser(id, updates),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('User updated') },
    onError:    (e: Error) => toast.error('Update failed', e.message),
  })

  const deleteUser = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('User deleted') },
    onError:    (e: Error) => toast.error('Delete failed', e.message),
  })

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2"><Users className="h-7 w-7 text-brand-500" />User Management</h1>
        <p className="text-muted-foreground">Manage all platform accounts.</p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
          {(['all', 'student', 'teacher', 'admin'] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                roleFilter === r ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
              {r === 'all' ? 'All' : r + 's'}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card><CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Class / Grade</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{u.role}</Badge></td>
                  <td className="px-4 py-3">
                    {u.role === 'student' ? (
                      <select
                        value={u.grade || ''}
                        onChange={e => updateUser.mutate({ id: u.id, updates: { grade: e.target.value || null } })}
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <option value="">Unassigned</option>
                        {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                    ) : u.role === 'teacher' ? (
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {GRADES.map(g => {
                          const on = (u.classes || []).includes(g.value)
                          return (
                            <button key={g.value} type="button"
                              onClick={() => {
                                const next = on
                                  ? (u.classes || []).filter(c => c !== g.value)
                                  : [...(u.classes || []), g.value]
                                updateUser.mutate({ id: u.id, updates: { classes: next } })
                              }}
                              className={cn('px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all',
                                on ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                                   : 'border-border text-muted-foreground hover:border-brand-300')}>
                              {g.label}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge variant={u.isActive ? 'success' : 'destructive'}>{u.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{u.createdAt ? formatRelative(u.createdAt) : '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.lastLogin ? formatRelative(u.lastLogin) : 'Never'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" title={u.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => updateUser.mutate({ id: u.id, updates: { isActive: !u.isActive } })}>
                        {u.isActive ? <UserX className="h-4 w-4 text-amber-500" /> : <UserCheck className="h-4 w-4 text-emerald-500" />}
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete"
                        onClick={() => { if (confirm(`Delete ${u.name}?`)) deleteUser.mutate(u.id) }}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (<tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No users match your filters.</td></tr>)}
            </tbody>
          </table>
        )}
      </CardContent></Card>
    </div>
  )
}

// ── Assessments Management ───────────────────────────────────────────────────
export function AssessmentsManagementPage() {
  const { data: assessments = [], isLoading } = useQuery({
    queryKey: queryKeys.adminAssessments,
    queryFn: () => adminApi.listAssessments(50),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2"><FileText className="h-7 w-7 text-brand-500" />Assessments</h1>
        <p className="text-muted-foreground">All assessments across the platform.</p>
      </div>
      <Card><CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Started</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Classification</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map(a => (
                <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3"><Avatar name={a.studentName} size="sm" /><span className="font-medium">{a.studentName}</span></div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={a.status === 'completed' ? 'success' : 'warning'} className="capitalize">{a.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{a.startedAt ? formatRelative(a.startedAt) : '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.completedAt ? formatRelative(a.completedAt) : '—'}</td>
                  <td className="px-4 py-3 font-semibold">{a.overallScore != null ? `${a.overallScore}%` : '—'}</td>
                  <td className="px-4 py-3 text-xs">{a.primaryDifficulty ? a.primaryDifficulty.replace(/_/g, ' ') : '—'}</td>
                </tr>
              ))}
              {assessments.length === 0 && (<tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No assessments yet.</td></tr>)}
            </tbody>
          </table>
        )}
      </CardContent></Card>
    </div>
  )
}

// ── Content Management ───────────────────────────────────────────────────────
export function ContentPage() {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminContent, queryFn: adminApi.content })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Content Library</h1>
        <p className="text-muted-foreground">All learning materials available on the platform.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="font-display text-xl font-bold">{data?.total ?? '—'}</p></CardContent></Card>
        {data && Object.entries(data.byDomain).map(([d, n]) => (
          <Card key={d}><CardContent className="p-4"><p className="text-xs text-muted-foreground capitalize">{d}</p><p className="font-display text-xl font-bold">{n}</p></CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr><th className="px-4 py-3 font-medium">Title</th><th className="px-4 py-3">Domain</th><th className="px-4 py-3">Format</th><th className="px-4 py-3">Duration</th><th className="px-4 py-3">Rating</th></tr>
            </thead>
            <tbody>
              {(data?.materials || []).map((m: any) => (
                <tr key={m.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{m.title}</td>
                  <td className="px-4 py-3 capitalize">{m.domain}</td>
                  <td className="px-4 py-3 capitalize">{m.format}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.estimatedDuration}m</td>
                  <td className="px-4 py-3">{m.rating ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent></Card>
    </div>
  )
}

// ── Analytics ────────────────────────────────────────────────────────────────
export function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminAnalytics, queryFn: adminApi.analytics })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Platform Analytics</h1>
        <p className="text-muted-foreground">Long-term growth and engagement trends.</p>
      </div>
      {isLoading ? (
        <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Assessment Completions</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data?.assessmentCompletions || []} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data?.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b91fd" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ── System ───────────────────────────────────────────────────────────────────
export function SystemPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.adminSystem,
    queryFn: adminApi.system,
    refetchInterval: 15000,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2"><Server className="h-7 w-7 text-brand-500" />System Health</h1>
          <p className="text-muted-foreground">Live status of all platform services.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
      </div>
      {isLoading || !data ? (
        <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Status</p><p className="font-semibold mt-1 text-emerald-600">{data.systemStatus}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Active Users</p><p className="font-display text-xl font-bold">{data.activeConnections}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Platform</p><p className="font-medium mt-1">{data.platform}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Python</p><p className="font-mono text-sm mt-1">{data.pythonVersion}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Services</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.services.map(s => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    {s.status === 'online' ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
                    <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground capitalize">{s.status}</p></div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground"><p>Uptime: {s.uptime}</p><p>Ping: {s.ping}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

// ── Audit Logs ───────────────────────────────────────────────────────────────
const levelColors: Record<string, string> = {
  info:    'text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400',
  success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
  warning: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
  error:   'text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-400',
}

export function LogsPage() {
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: queryKeys.adminLogs,
    queryFn: () => adminApi.logs(100),
    refetchInterval: 30000,
  })
  const [filter, setFilter] = useState<string>('all')
  const visible = logs.filter(l => filter === 'all' || l.level === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2"><FileText className="h-7 w-7 text-brand-500" />Audit Logs</h1>
          <p className="text-muted-foreground">All system activity recorded by the platform.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
      </div>
      <Card>
        <CardContent className="p-4 flex gap-2 flex-wrap">
          {(['all', 'info', 'success', 'warning', 'error'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
              {f}
            </button>
          ))}
        </CardContent>
      </Card>
      <Card><CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">IP</th><th className="px-4 py-3">Detail</th></tr>
            </thead>
            <tbody>
              {visible.map(l => (
                <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{formatRelative(l.time)}</td>
                  <td className="px-4 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', levelColors[l.level])}>{l.level}</span></td>
                  <td className="px-4 py-3">{l.user}</td>
                  <td className="px-4 py-3 font-medium">{l.action}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{l.ip}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs truncate max-w-xs">{l.detail || '—'}</td>
                </tr>
              ))}
              {visible.length === 0 && (<tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No log entries.</td></tr>)}
            </tbody>
          </table>
        )}
      </CardContent></Card>
    </div>
  )
}

// ── Admin Settings ───────────────────────────────────────────────────────────
export function AdminSettingsPage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useUIStore()
  if (!user) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2"><Settings className="h-7 w-7 text-brand-500" />Settings</h1>
        <p className="text-muted-foreground">System and personal preferences.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Admin Profile</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="xl" />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="mt-1">Administrator</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Platform Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span>Self-registration enabled</span><Switch checked onCheckedChange={() => {}} /></div>
          <div className="flex items-center justify-between"><span>Email notifications</span><Switch checked onCheckedChange={() => {}} /></div>
          <div className="flex items-center justify-between"><span>Maintenance mode</span><Switch checked={false} onCheckedChange={() => {}} /></div>
        </CardContent>
      </Card>
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
