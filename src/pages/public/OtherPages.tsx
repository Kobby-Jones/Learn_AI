import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, ArrowLeft, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/primitives'
import { useState } from 'react'
import { toast } from '@/components/ui/toast'

const PublicNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <span className="font-display font-bold text-lg gradient-text">LearnAI</span>
      </Link>
      <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
    </div>
  </nav>
)

// ─── About Page ─────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="font-display text-4xl font-bold mb-4">About LearnAI</h1>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            LearnAI is an AI-powered educational platform designed to detect learning difficulties early and deliver personalized support to students aged 8–16.
          </p>
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Our Mission</h2>
              <p>We believe every student deserves timely support. Our platform bridges the gap between identifying learning challenges and delivering targeted instructional content, grounded in peer-reviewed research using validated datasets including ARC, CoLA, RACE, TIMSS, and Cambridge Brain Sciences data.</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">The Technology</h2>
              <p>Our classification engine uses four supervised machine learning algorithms — Logistic Regression, Random Forest, Support Vector Machine, and XGBoost — trained on student performance data across five cognitive domains: Mathematics, Grammar, Reading Comprehension, Memory, and Reasoning.</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Research Foundation</h2>
              <p>This system is based on a formal academic research project applying design science research methodology. Assessment instruments and classification models are grounded in published empirical studies on learning difficulty prevalence and cognitive assessment.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── FAQ Page ────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'What is LearnAI?', a: 'LearnAI is an AI-powered web platform that assesses students across five cognitive domains and uses machine learning to classify potential learning difficulties, then recommends personalized learning materials.' },
  { q: 'Who can use LearnAI?', a: 'The platform serves three types of users: students (aged 8–16) who take assessments, teachers who monitor student progress, and administrators who manage the platform.' },
  { q: 'How accurate are the classifications?', a: 'Our models achieve approximately 87% classification accuracy using ensemble methods. However, the system is a screening tool and not a clinical diagnosis. Students flagged should be referred for formal professional assessment.' },
  { q: 'What domains does the assessment cover?', a: 'The assessment covers five domains: Mathematics (using TIMSS data), Grammar (using CoLA data), Reading Comprehension (using RACE data), Memory (using Cambridge Brain Sciences data), and Reasoning (using ARC data).' },
  { q: 'How long does an assessment take?', a: 'A full assessment across all five domains takes approximately 30–45 minutes. Students can pause and resume if needed.' },
  { q: 'Is my data private?', a: 'Yes. All student data is stored securely with strict access controls. Personal identifiers are kept separate from performance data, and no data is shared with third parties.' },
  { q: 'How are learning materials selected?', a: 'Our recommendation engine uses content-based filtering, matching materials from platforms like Khan Academy, BBC Bitesize, and Reading Rockets to each student\'s specific difficulty profile and severity estimate.' },
]

export function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="font-display text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-10">Everything you need to know about LearnAI.</p>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl overflow-hidden">
                <button className="w-full flex items-center justify-between p-5 text-left font-medium"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span>{f.q}</span>
                  {open === i ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                    {f.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Contact Page ────────────────────────────────────────────────────────────
export function ContactPage() {
  const [sent, setSent] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success('Message sent!', 'We\'ll get back to you within 48 hours.')
  }
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="font-display text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground mb-10">Get in touch with the LearnAI team.</p>
          {!sent ? (
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="fname">First name</Label><Input id="fname" className="mt-1.5" required /></div>
                <div><Label htmlFor="lname">Last name</Label><Input id="lname" className="mt-1.5" required /></div>
              </div>
              <div><Label htmlFor="cemail">Email</Label><Input id="cemail" type="email" className="mt-1.5" required /></div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea id="message" rows={5} required
                  className="mt-1.5 flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </div>
              <Button type="submit" size="lg" variant="gradient" className="w-full">Send Message</Button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground">We'll get back to you within 48 hours.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Forgot Password Page ────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true) }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
        <div className="glass-card rounded-2xl p-8">
          {!sent ? (
            <>
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-5">
                <Mail className="h-6 w-6 text-brand-500" />
              </div>
              <h1 className="font-display text-2xl font-bold mb-2">Forgot password?</h1>
              <p className="text-muted-foreground text-sm mb-6">Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" required />
                </div>
                <Button type="submit" className="w-full" size="lg" variant="gradient">Send Reset Link</Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm">We've sent a password reset link to <strong>{email}</strong></p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
