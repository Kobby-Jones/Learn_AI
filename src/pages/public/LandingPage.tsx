import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, ArrowRight, CheckCircle, Star, Zap, Shield,
  BarChart3, BookOpen, Users, Sparkles, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/uiStore'
import { Sun, Moon } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
}

const features = [
  { icon: <Brain className="h-6 w-6" />, title: 'AI-Powered Classification', desc: 'Advanced ML models identify learning difficulty profiles with high accuracy across five cognitive domains.', color: 'from-brand-500 to-brand-600' },
  { icon: <BarChart3 className="h-6 w-6" />, title: 'Detailed Analytics', desc: 'Comprehensive dashboards show performance trends, domain strengths, and improvement trajectories.', color: 'from-teal-500 to-teal-600' },
  { icon: <BookOpen className="h-6 w-6" />, title: 'Personalized Learning', desc: 'Curated recommendations mapped directly to each student\'s unique difficulty profile and learning needs.', color: 'from-violet-500 to-violet-600' },
  { icon: <Shield className="h-6 w-6" />, title: 'Evidence-Based', desc: 'Assessment instrument grounded in peer-reviewed research using validated public datasets.', color: 'from-rose-500 to-rose-600' },
  { icon: <Zap className="h-6 w-6" />, title: 'Instant Results', desc: 'Real-time processing delivers classification results immediately after assessment completion.', color: 'from-amber-500 to-amber-600' },
  { icon: <Users className="h-6 w-6" />, title: 'Multi-Role Platform', desc: 'Separate dashboards for students, teachers, and administrators with role-specific insights.', color: 'from-emerald-500 to-emerald-600' },
]

const domains = [
  { name: 'Mathematics', color: '#f59e0b', icon: '∑' },
  { name: 'Grammar', color: '#8b5cf6', icon: 'Aa' },
  { name: 'Reading', color: '#3b82f6', icon: '📖' },
  { name: 'Memory', color: '#14b8a6', icon: '🧠' },
  { name: 'Reasoning', color: '#f43f5e', icon: '⚡' },
]

const stats = [
  { label: 'Students Assessed', value: '1,200+' },
  { label: 'Accuracy Rate', value: '87%' },
  { label: 'Learning Resources', value: '300+' },
  { label: 'Schools Using Platform', value: '14' },
]

export default function LandingPage() {
  const { theme, setTheme } = useUIStore()
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">LearnAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-muted-foreground hover:text-foreground transition-colors">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
            <Link to="/register"><Button size="sm" variant="gradient">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            AI-Powered Educational Assessment Platform
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Detect Learning<br />
            <span className="gradient-text">Difficulties Early</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Our intelligent platform assesses students across five cognitive domains, classifies learning difficulty profiles using machine learning, and delivers personalized learning recommendations.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="xl" variant="gradient" className="group">
                Start Free Assessment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="xl" variant="outline">Learn More</Button>
            </Link>
          </motion.div>
        </div>

        {/* Domain pills */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center mt-16">
          {domains.map(d => (
            <div key={d.name} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium">
              <span>{d.icon}</span>
              <span>{d.name}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-center">
              <p className="font-display text-4xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive platform built on validated research datasets and modern machine learning.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="group p-6 rounded-2xl glass-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} items-center justify-center text-white mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-teal-600 -z-10" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 -z-10" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Support Every Learner?
          </h2>
          <p className="text-lg mb-10">
            Join hundreds of educators using LearnAI to identify and support students with learning difficulties.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="xl" className="bg-white text-brand-700 hover:bg-white/90">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="xl" variant="gradient" className="border-white/40 hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-brand-500" />
            <span className="font-display font-semibold text-foreground">LearnAI</span>
            <span>— AI-Powered Learning Difficulty Detection</span>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
