import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Eye, EyeOff, GraduationCap, BookOpen, Shield, ArrowRight, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/primitives'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

const roles = [
  { value: 'student' as UserRole, label: 'Student',       icon: <GraduationCap className="h-5 w-5" />, desc: 'Take assessments and track progress' },
  { value: 'teacher' as UserRole, label: 'Teacher',       icon: <BookOpen className="h-5 w-5" />,      desc: 'Monitor and support your students'   },
  { value: 'admin'   as UserRole, label: 'Administrator', icon: <Shield className="h-5 w-5" />,        desc: 'Manage platform and analytics'       },
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [teacherCode, setTeacherCode] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { register, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await register({ name, email, password, role, teacherCode: role === 'teacher' ? teacherCode : undefined })
    const user = useAuthStore.getState().user
    if (user) {
      toast.success('Account created!', 'Welcome to LearnAI')
      navigate(`/${user.role}/dashboard`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">LearnAI</span>
          </Link>

          <div className="glass-card rounded-2xl p-8">
            <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
            <p className="text-muted-foreground text-sm mb-6">Join LearnAI and get started today</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="mb-2 block">I am a...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(r => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all text-sm',
                        role === r.value
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                          : 'border-border hover:border-brand-300 text-muted-foreground',
                      )}>
                      {r.icon}
                      <span className="font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name" className="mt-1.5" required />
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="mt-1.5" required />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Input id="password" type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {role === 'teacher' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <Label htmlFor="teacherCode" className="flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" /> Teacher registration code
                  </Label>
                  <Input id="teacherCode" value={teacherCode} onChange={e => setTeacherCode(e.target.value)}
                    placeholder="Provided by your administrator" className="mt-1.5" required />
                  <p className="text-xs text-muted-foreground mt-1">Default for this demo: <code className="text-foreground">TEACHER2024</code></p>
                </motion.div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={isLoading} variant="gradient">
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
