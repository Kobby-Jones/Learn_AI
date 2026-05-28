import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Users, BookOpen, TrendingUp, AlertCircle, ArrowRight, Activity, Award, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, Badge } from '@/components/ui/primitives'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { formatRelative, getDifficultyColor } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { teacherApi, queryKeys } from '@/api'

const COLORS = ['#f43f5e', '#f59e0b', '#3b82f6', '#14b8a6', '#8b5cf6', '#10b981']

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const statsQ    = useQuery({ queryKey: queryKeys.teacherClassroom, queryFn: teacherApi.classroomStats })
  const studentsQ = useQuery({ queryKey: queryKeys.teacherStudents,  queryFn: teacherApi.listStudents })

  const stats = statsQ.data
  const students = studentsQ.data || []
  const atRiskCount = students.filter(s => s.riskLevel === 'high').length
  const atRisk = students.filter(s => s.riskLevel === 'high').slice(0, 4)

  const difficultyData = stats ? Object.entries(stats.difficultyBreakdown)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k.replace(/_/g, ' '), value: v })) : []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back, {user?.name.split(' ').slice(-1)[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's the overview of your students today.</p>
        </div>
        <Link to="/teacher/students">
          <Button variant="gradient"><Users className="h-4 w-4" />View All Students<ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',    value: stats?.totalStudents ?? '—',    icon: <Users className="h-5 w-5" />,    color: 'brand'  },
          { label: 'Assessed',           value: stats?.assessedStudents ?? '—', icon: <BookOpen className="h-5 w-5" />, color: 'teal'   },
          { label: 'Class Average',      value: stats ? `${stats.averageScore}%` : '—', icon: <Award className="h-5 w-5" />,    color: 'violet' },
          { label: 'High Risk Students', value: atRiskCount,                    icon: <AlertCircle className="h-5 w-5" />,color: 'rose'   },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl bg-${s.color}-100 dark:bg-${s.color}-950 text-${s.color}-600 flex items-center justify-center`}>
                    {s.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-violet-500" />Difficulty Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {difficultyData.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-10">No assessment data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={difficultyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(d: any) => `${d.value}`}>
                      {difficultyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-rose-500" />Students Needing Attention</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {atRisk.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No high-risk students 🎉</p>}
              {atRisk.map(s => (
                <Link to="/teacher/students" key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar name={s.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    {s.primaryDifficulty && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(s.primaryDifficulty)}`}>
                        {s.primaryDifficulty.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{s.averageScore}%</p>
                    <p className="text-xs text-muted-foreground">{s.totalAssessments} tests</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-teal-500" />Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(stats?.recentActivity || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No recent activity yet.</p>}
            {(stats?.recentActivity || []).map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar name={a.studentName} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{a.studentName}</p>
                    <p className="text-xs text-muted-foreground">{a.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{formatRelative(a.time)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
