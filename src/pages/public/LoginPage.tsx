import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/primitives'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/components/ui/toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
    const user = useAuthStore.getState().user
    if (user) {
      toast.success('Welcome back!', `Signed in as ${user.name}`)
      navigate(`/${user.role}/dashboard`)
    }
  }

  const demoAccounts = [
    { label: 'Student', email: 'alex@student.edu', password: 'demo' },
    { label: 'Teacher', email: 'swilliams@school.edu', password: 'demo' },
    { label: 'Admin', email: 'admin@learnai.edu', password: 'demo' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-teal-700 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
        <Link to="/" className="flex items-center gap-3 relative">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Brain className="h-6 w-6" />
          </div>
          <span className="font-display font-bold text-xl">LearnAI</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
          <h2 className="font-display text-5xl font-bold leading-tight mb-6">
            Empowering<br />Every Learner
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Our AI platform detects learning difficulties early and delivers personalized support to help every student thrive.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 relative">
          {[['87%', 'Classification Accuracy'], ['1,200+', 'Students Assessed'], ['300+', 'Learning Resources'], ['5', 'Assessment Domains']].map(([v, l]) => (
            <div key={l} className="bg-white/10 rounded-xl p-4">
              <p className="font-display text-2xl font-bold">{v}</p>
              <p className="text-white/70 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
              <Brain className="h-6 w-6 text-brand-500" />
              <span className="font-display font-bold text-lg gradient-text">LearnAI</span>
            </Link>
            <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className="mt-1.5" required autoComplete="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:text-brand-700">Create one</Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center mb-3 font-medium">DEMO ACCOUNTS</p>
            <div className="space-y-2">
              {demoAccounts.map(acc => (
                <button key={acc.label} type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.password) }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-background transition-colors text-sm flex items-center justify-between group">
                  <div>
                    <span className="font-medium">{acc.label}</span>
                    <span className="text-muted-foreground ml-2">{acc.email}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
