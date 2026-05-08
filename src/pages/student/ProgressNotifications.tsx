import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Bell, CheckCircle, AlertCircle, Info, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/primitives'
import { mockProgressData, mockNotifications } from '@/mock/data'
import { formatRelative, getDomainColor } from '@/lib/utils'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { cn } from '@/lib/utils'

// ─── Progress Page ──────────────────────────────────────────────────────────
export function ProgressPage() {
  const domains = ['mathematics', 'grammar', 'reading', 'memory', 'reasoning']
  const latest = mockProgressData[mockProgressData.length - 1]
  const prev = mockProgressData[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">My Progress</h1>
        <p className="text-muted-foreground">Track your improvement across all five domains over time.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {domains.map((d, i) => {
          const val = latest[d as keyof typeof latest] as number
          const prevVal = prev[d as keyof typeof prev] as number
          const diff = val - prevVal
          return (
            <motion.div key={d} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="h-10 w-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: getDomainColor(d) + '20' }}>
                    <span style={{ color: getDomainColor(d) }} className="text-sm font-bold">{val}%</span>
                  </div>
                  <p className="text-xs font-medium capitalize">{d}</p>
                  <p className={cn('text-xs mt-0.5', diff >= 0 ? 'text-emerald-600' : 'text-rose-500')}>
                    {diff >= 0 ? '+' : ''}{diff}pts
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Main trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-brand-500" /> Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={mockProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis domain={[30, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Legend />
              {domains.map(d => (
                <Line key={d} type="monotone" dataKey={d} stroke={getDomainColor(d)} strokeWidth={2} dot={{ r: 3 }} name={d.charAt(0).toUpperCase() + d.slice(1)} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* History table */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Assessment History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Overall</th>
                  {domains.map(d => <th key={d} className="pb-3 font-medium capitalize">{d.slice(0, 4)}.</th>)}
                </tr>
              </thead>
              <tbody>
                {[...mockProgressData].reverse().map((row, i) => (
                  <tr key={row.date} className={cn('border-b border-border/50 hover:bg-muted/30', i === 0 && 'bg-brand-50/50 dark:bg-brand-950/20')}>
                    <td className="py-3 text-muted-foreground">{row.date}</td>
                    <td className="py-3 font-semibold">{row.overallScore}%</td>
                    {domains.map(d => (
                      <td key={d} className="py-3" style={{ color: getDomainColor(d) }}>
                        {row[d as keyof typeof row]}%
                      </td>
                    ))}
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

// ─── Notifications Page ──────────────────────────────────────────────────────
export function NotificationsPage() {
  const notifIcons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-brand-500" />,
  }
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground">{mockNotifications.filter(n => !n.isRead).length} unread notifications</p>
        </div>
        <button className="text-sm text-brand-600 hover:text-brand-700">Mark all as read</button>
      </div>
      <div className="space-y-3">
        {mockNotifications.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={cn(!n.isRead && 'border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-950/20')}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="shrink-0 mt-0.5">{notifIcons[n.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />{formatRelative(n.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
