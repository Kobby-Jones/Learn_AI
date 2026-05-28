import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TrendingUp, Award, Calendar, Target, Bell, Check, CheckCheck, X, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/primitives'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatRelative, cn } from '@/lib/utils'
import { usersApi, notificationsApi, queryKeys } from '@/api'
import { toast } from '@/components/ui/toast'
import type { Notification } from '@/types'

// ── Progress ─────────────────────────────────────────────────────────────────
export function ProgressPage() {
  const statsQ    = useQuery({ queryKey: queryKeys.userStats,    queryFn: usersApi.stats })
  const progressQ = useQuery({ queryKey: queryKeys.userProgress, queryFn: usersApi.progress })

  const stats = statsQ.data
  const progress = progressQ.data || []
  const latest = progress[progress.length - 1]
  const first  = progress[0]

  const improvements = useMemo(() => {
    if (!latest || !first) return null
    return {
      mathematics: latest.mathematics - first.mathematics,
      grammar:     latest.grammar     - first.grammar,
      reading:     latest.reading     - first.reading,
      memory:      latest.memory      - first.memory,
      reasoning:   latest.reasoning   - first.reasoning,
    }
  }, [latest, first])

  if (statsQ.isLoading || progressQ.isLoading) {
    return <div className="text-center py-20"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-brand-500" /> Your Progress
        </h1>
        <p className="text-muted-foreground">Track your learning journey over time.</p>
      </div>

      {/* Achievement-style stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Streak Days',        value: stats?.streakDays ?? 0,         icon: <Award className="h-5 w-5" />,    color: 'amber'  },
          { label: 'Assessments',        value: stats?.totalAssessments ?? 0,   icon: <Calendar className="h-5 w-5" />, color: 'brand'  },
          { label: 'Average Score',      value: `${stats?.averageScore ?? 0}%`, icon: <Target className="h-5 w-5" />,   color: 'emerald' },
          { label: 'Improvement',        value: `${(stats?.improvementRate ?? 0) >= 0 ? '+' : ''}${stats?.improvementRate ?? 0}%`, icon: <TrendingUp className="h-5 w-5" />, color: 'teal' },
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-brand-500" /> Domain Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {progress.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">Complete an assessment to start tracking your progress.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="mathematics" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="grammar"     stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="reading"     stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="memory"      stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="reasoning"   stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {improvements && (
        <Card>
          <CardHeader><CardTitle>Improvement Since First Assessment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(improvements).map(([domain, delta]) => (
              <div key={domain}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="capitalize font-medium">{domain}</span>
                  <span className={delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    {delta >= 0 ? '+' : ''}{delta}%
                  </span>
                </div>
                <Progress value={Math.min(100, Math.max(0, latest?.[domain as keyof typeof improvements] ?? 0))} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── Notifications ────────────────────────────────────────────────────────────
const typeIcons: Record<Notification['type'], React.ReactNode> = {
  info:    <Info className="h-4 w-4 text-brand-500" />,
  success: <Check className="h-4 w-4 text-emerald-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
  error:   <X className="h-4 w-4 text-rose-500" />,
}

export function NotificationsPage() {
  const qc = useQueryClient()
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationsApi.list,
  })

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: queryKeys.notifications }),
  })

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications })
      toast.success('All caught up!', 'All notifications marked as read.')
    },
  })

  const unread = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
            <Bell className="h-7 w-7 text-brand-500" /> Notifications
            {unread > 0 && <span className="text-sm bg-brand-500 text-white px-2 py-0.5 rounded-full">{unread}</span>}
          </h1>
          <p className="text-muted-foreground">Stay updated with your learning activity.</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" loading={markAll.isPending} onClick={() => markAll.mutate()}>
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-16"><div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" /></div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">You're all caught up</p>
            <p className="text-sm text-muted-foreground mt-1">New notifications will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', !n.isRead && 'border-l-4 border-l-brand-500')}
                onClick={() => !n.isRead && markRead.mutate(n.id)}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{typeIcons[n.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm', !n.isRead && 'font-semibold')}>{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatRelative(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
