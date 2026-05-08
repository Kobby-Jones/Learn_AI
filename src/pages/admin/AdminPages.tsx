import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, BarChart3, Brain, Activity, Shield, Database,
  TrendingUp, AlertCircle, CheckCircle, Settings, Search,
  Trash2, Edit, Download, Eye, RefreshCw, Server, Monitor
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Avatar, Progress, Skeleton } from '@/components/ui/primitives'
import { mockAdminStats, mockStudents } from '@/mock/data'
import { formatRelative, getDifficultyColor, cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'
import { toast } from '@/components/ui/toast'

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
export function AdminDashboard() {
  const stats = mockAdminStats

  const diffData = Object.entries(stats.difficultyDistribution).map(([k, v]) => ({
    name: k.replace(/_/g, ' '), value: v
  }))
  const COLORS = ['#8b5cf6', '#f59e0b', '#3b82f6', '#14b8a6', '#f43f5e', '#10b981']

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide overview and management.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: <Users className="h-5 w-5" />, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-950', trend: '+12%' },
          { label: 'Active Students', value: stats.activeStudents.toLocaleString(), icon: <Brain className="h-5 w-5" />, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950', trend: '+8%' },
          { label: 'Today\'s Assessments', value: stats.assessmentsToday, icon: <Activity className="h-5 w-5" />, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950', trend: '+3' },
          { label: 'Total Assessments', value: stats.assessmentsTotal.toLocaleString(), icon: <BarChart3 className="h-5 w-5" />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950', trend: 'All time' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{s.trend}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>{s.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle className="text-base">Difficulty Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={diffData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {diffData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {diffData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground capitalize truncate max-w-[120px]">{d.name}</span>
                    </div>
                    <span className="font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" />Weekly Activity</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#3b91fd" radius={[4, 4, 0, 0]} name="Assessments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader><CardTitle className="text-base">Domain Performance Averages</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.domainAverages).map(([d, v]) => (
                <div key={d} className="flex items-center gap-4">
                  <span className="w-28 text-sm capitalize text-muted-foreground shrink-0">{d}</span>
                  <Progress value={v} className="flex-1 h-2" />
                  <span className="text-sm font-semibold w-10 text-right">{v}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Users Management ────────────────────────────────────────────────────────
export function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const allUsers = [
    ...mockStudents.map(s => ({ ...s, role: 'student', isActive: true })),
    { id: 'u2', name: 'Ms. Sarah Williams', email: 'swilliams@school.edu', role: 'teacher', lastActivity: new Date().toISOString(), isActive: true, averageScore: 0, totalAssessments: 0, trend: 'stable' as const },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div><h1 className="font-display text-3xl font-bold mb-1">User Management</h1>
          <p className="text-muted-foreground">{allUsers.length} total users</p></div>
        <Button variant="gradient" onClick={() => toast.success('Invite sent', 'User invitation email sent')}><Users className="h-4 w-4" /> Invite User</Button>
      </div>
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {['all', 'student', 'teacher', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all', roleFilter === r ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
              {r}
            </button>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Last Active</th>
              <th className="p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {allUsers.filter(u => {
                if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false
                if (roleFilter !== 'all' && u.role !== roleFilter) return false
                return true
              }).map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4"><div className="flex items-center gap-3"><Avatar name={u.name} size="sm" /><div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div></div></td>
                  <td className="p-4 capitalize"><Badge variant="outline">{u.role}</Badge></td>
                  <td className="p-4"><span className="flex items-center gap-1.5 text-emerald-600 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active</span></td>
                  <td className="p-4 text-muted-foreground">{formatRelative(u.lastActivity)}</td>
                  <td className="p-4"><div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600"><Trash2 className="h-3 w-3" /></Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Assessments Management ──────────────────────────────────────────────────
export function AssessmentsManagementPage() {
  const recent = Array.from({ length: 8 }, (_, i) => ({
    id: `a${i}`, student: mockStudents[i % mockStudents.length].name,
    status: ['completed', 'in_progress', 'completed', 'completed'][i % 4],
    score: Math.floor(Math.random() * 40 + 55),
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    difficulty: ['reading_comprehension', 'dyscalculia_related', 'no_significant_difficulty'][i % 3],
  }))
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold mb-1">Assessment Management</h1></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: mockAdminStats.assessmentsTotal },
          { label: 'Today', value: mockAdminStats.assessmentsToday },
          { label: 'Completed', value: mockAdminStats.assessmentsTotal - 47 },
          { label: 'In Progress', value: 47 },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-5 text-center">
            <p className="font-display text-3xl font-bold">{s.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Assessments</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Student</th><th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Score</th><th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Classification</th><th className="p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {recent.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4 font-medium">{a.student}</td>
                  <td className="p-4 text-muted-foreground">{a.date}</td>
                  <td className="p-4 font-semibold">{a.score}%</td>
                  <td className="p-4"><Badge variant={a.status === 'completed' ? 'success' : 'warning'} className="capitalize">{a.status.replace('_', ' ')}</Badge></td>
                  <td className="p-4"><span className={cn('text-xs px-2 py-0.5 rounded-full', getDifficultyColor(a.difficulty))}>{a.difficulty.replace(/_/g, ' ')}</span></td>
                  <td className="p-4"><Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye className="h-3 w-3" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Content Management ──────────────────────────────────────────────────────
export function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div><h1 className="font-display text-3xl font-bold mb-1">Content Management</h1>
          <p className="text-muted-foreground">Manage learning materials and recommendation content.</p></div>
        <Button variant="gradient"><Database className="h-4 w-4" /> Add Material</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['Mathematics', 'Grammar', 'Reading', 'Memory', 'Reasoning'].map((d, i) => (
          <Card key={d}><CardContent className="p-5 text-center">
            <p className="font-display text-2xl font-bold">{[24, 18, 32, 16, 21][i]}</p>
            <p className="text-sm text-muted-foreground mt-1">{d}</p>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-6 text-center text-muted-foreground">
        <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium mb-1">Content editor coming soon</p>
        <p className="text-sm">Manage, edit and approve learning materials from this panel.</p>
      </CardContent></Card>
    </div>
  )
}

// ─── Admin Analytics ─────────────────────────────────────────────────────────
export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold mb-1">Platform Analytics</h1></div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Assessment Completions</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={[
                { month: 'Sep', count: 120 }, { month: 'Oct', count: 198 }, { month: 'Nov', count: 245 },
                { month: 'Dec', count: 187 }, { month: 'Jan', count: 312 }, { month: 'Feb', count: 387 },
              ]}>
                <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b91fd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b91fd" stopOpacity={0} />
                </linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="#3b91fd" fill="url(#areaGrad)" strokeWidth={2} name="Assessments" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={[
                { month: 'Sep', users: 320 }, { month: 'Oct', users: 480 }, { month: 'Nov', users: 650 },
                { month: 'Dec', users: 820 }, { month: 'Jan', users: 1050 }, { month: 'Feb', users: 1247 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke="#14b8a6" strokeWidth={2} dot={false} name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── System Monitoring ───────────────────────────────────────────────────────
export function SystemPage() {
  const services = [
    { name: 'API Server', status: 'online', uptime: '99.9%', ping: '12ms' },
    { name: 'ML Classification Engine', status: 'online', uptime: '99.7%', ping: '847ms' },
    { name: 'Database', status: 'online', uptime: '99.99%', ping: '4ms' },
    { name: 'File Storage', status: 'online', uptime: '99.8%', ping: '28ms' },
    { name: 'Email Service', status: 'degraded', uptime: '97.2%', ping: '320ms' },
  ]
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-bold mb-1">System Monitoring</h1></div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'System Status', value: 'Operational', icon: <CheckCircle className="h-5 w-5 text-emerald-500" /> },
          { label: 'Active Connections', value: '247', icon: <Activity className="h-5 w-5 text-brand-500" /> },
          { label: 'CPU Usage', value: '34%', icon: <Server className="h-5 w-5 text-amber-500" /> },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-5 flex items-center gap-3">
            {s.icon}<div><p className="text-sm text-muted-foreground">{s.label}</p><p className="font-bold">{s.value}</p></div>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Service Status</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {services.map(s => (
            <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <span className={cn('h-2.5 w-2.5 rounded-full', s.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500')} />
                <span className="font-medium text-sm">{s.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{s.ping}</span><span>{s.uptime}</span>
                <Badge variant={s.status === 'online' ? 'success' : 'warning'} className="capitalize">{s.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────
export function LogsPage() {
  const logs = Array.from({ length: 15 }, (_, i) => ({
    id: i, action: ['User login', 'Assessment completed', 'Report generated', 'User registered', 'Settings updated'][i % 5],
    user: mockStudents[i % mockStudents.length].name,
    ip: `192.168.1.${(i * 7 + 100) % 255}`,
    time: new Date(Date.now() - i * 300000).toLocaleString(),
    level: ['info', 'success', 'warning', 'info', 'info'][i % 5],
  }))
  const colors = { info: 'text-brand-500', success: 'text-emerald-500', warning: 'text-amber-500' }
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div><h1 className="font-display text-3xl font-bold mb-1">Audit Logs</h1></div>
        <Button variant="outline" onClick={() => toast.info('Export', 'Generating log export...')}><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Time</th><th className="p-4 font-medium">Action</th>
              <th className="p-4 font-medium">User</th><th className="p-4 font-medium">IP</th><th className="p-4 font-medium">Level</th>
            </tr></thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4 text-muted-foreground font-mono text-xs">{l.time}</td>
                  <td className="p-4">{l.action}</td>
                  <td className="p-4 text-muted-foreground">{l.user}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">{l.ip}</td>
                  <td className="p-4"><span className={cn('text-xs font-semibold capitalize', colors[l.level as keyof typeof colors])}>{l.level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Admin Settings ──────────────────────────────────────────────────────────
export function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="font-display text-3xl font-bold mb-1">Platform Settings</h1></div>
      {[
        { title: 'General', desc: 'Platform name, timezone, language', icon: <Settings className="h-5 w-5" /> },
        { title: 'Security', desc: 'Session timeout, 2FA, password policy', icon: <Shield className="h-5 w-5" /> },
        { title: 'ML Model', desc: 'Classification thresholds and model selection', icon: <Brain className="h-5 w-5" /> },
        { title: 'Notifications', desc: 'Email and system notification settings', icon: <Activity className="h-5 w-5" /> },
      ].map(s => (
        <Card key={s.title} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-500 flex items-center justify-center">{s.icon}</div>
              <div><p className="font-medium">{s.title}</p><p className="text-sm text-muted-foreground">{s.desc}</p></div>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info(s.title, 'Settings panel coming soon')}>Configure</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
