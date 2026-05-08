import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, BarChart3, TrendingUp, AlertCircle, ArrowRight, Brain, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Avatar } from '@/components/ui/primitives'
import { useAuthStore } from '@/store/authStore'
import { mockStudents, mockClassroomStats } from '@/mock/data'
import { getDifficultyColor, formatRelative, cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const riskColors: Record<string, string> = {
  low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
  moderate: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
  high: 'text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-400',
}

const trendIcons: Record<string, string> = { improving: '↗', stable: '→', declining: '↘' }
const trendColors: Record<string, string> = { improving: 'text-emerald-500', stable: 'text-muted-foreground', declining: 'text-rose-500' }

const diffPieData = [
  { name: 'Reading', value: 5, fill: '#3b82f6' },
  { name: 'Memory', value: 4, fill: '#14b8a6' },
  { name: 'Reasoning', value: 3, fill: '#f43f5e' },
  { name: 'Dyscalculia', value: 2, fill: '#f59e0b' },
  { name: 'Dyslexia', value: 3, fill: '#8b5cf6' },
  { name: 'None', value: 11, fill: '#10b981' },
]

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const stats = mockClassroomStats
  const firstName = user?.name.split(' ')[0] || 'Teacher'

  const assessedPct = Math.round((stats.assessedStudents / stats.totalStudents) * 100)
  const highRiskStudents = mockStudents.filter(s => s.riskLevel === 'high')

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome, {firstName} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your classroom overview.</p>
        </div>
        <Link to="/teacher/reports">
          <Button variant="outline"><FileText className="h-4 w-4" /> Generate Report</Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: <Users className="h-5 w-5" />, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-950' },
          { label: 'Assessed', value: `${stats.assessedStudents} (${assessedPct}%)`, icon: <Brain className="h-5 w-5" />, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950' },
          { label: 'Average Score', value: `${stats.averageScore}%`, icon: <BarChart3 className="h-5 w-5" />, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950' },
          { label: 'High Risk', value: highRiskStudents.length, icon: <AlertCircle className="h-5 w-5" />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>{s.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Difficulty distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle className="text-base">Difficulty Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={diffPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                    {diffPieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {diffPieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                    <span className="truncate text-muted-foreground">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students at risk */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-rose-500" /> Students Needing Attention</CardTitle>
                <Link to="/teacher/students" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  All students <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockStudents.slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.totalAssessments} assessments • avg {s.averageScore}%</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('text-xs', trendColors[s.trend])}>{trendIcons[s.trend]} {s.trend}</span>
                      {s.riskLevel && (
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', riskColors[s.riskLevel])}>
                          {s.riskLevel}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-sm border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.studentName} size="sm" />
                    <div>
                      <span className="font-medium">{a.studentName}</span>
                      <span className="text-muted-foreground"> — {a.action}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
