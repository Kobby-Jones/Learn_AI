import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Filter, ExternalLink, Clock, Star, Play, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress } from '@/components/ui/primitives'
import { mockRecommendations } from '@/mock/data'
import { cn, capitalize, getDomainColor } from '@/lib/utils'
import type { AssessmentDomain, ContentFormat } from '@/types'

const allMaterials = [
  ...mockRecommendations,
  {
    id: 'lib1', title: 'The Magic of Maths: Number Patterns',
    description: 'Discover the beauty of numerical patterns and sequences in everyday life.',
    domain: 'mathematics' as AssessmentDomain, difficultyLevel: 'beginner' as const, format: 'video' as ContentFormat,
    estimatedDuration: 12, url: '#', thumbnailUrl: 'https://picsum.photos/seed/math1/400/225',
    tags: ['patterns', 'numbers'], recommendationScore: 0.65, isBookmarked: false, progressPercent: 100,
    rating: 4.5, provider: 'Khan Academy',
  },
  {
    id: 'lib2', title: 'Punctuation Mastery Guide',
    description: 'A comprehensive guide to using punctuation correctly in written English.',
    domain: 'grammar' as AssessmentDomain, difficultyLevel: 'intermediate' as const, format: 'article' as ContentFormat,
    estimatedDuration: 15, url: '#', thumbnailUrl: 'https://picsum.photos/seed/gram1/400/225',
    tags: ['punctuation', 'writing'], recommendationScore: 0.60, isBookmarked: true, progressPercent: 75,
    rating: 4.1, provider: 'BBC Bitesize',
  },
  {
    id: 'lib3', title: 'Memory Palace Technique',
    description: 'Learn the ancient memory palace technique used by memory champions worldwide.',
    domain: 'memory' as AssessmentDomain, difficultyLevel: 'advanced' as const, format: 'interactive' as ContentFormat,
    estimatedDuration: 35, url: '#', thumbnailUrl: 'https://picsum.photos/seed/mem2/400/225',
    tags: ['memory palace', 'technique'], recommendationScore: 0.58, isBookmarked: false, progressPercent: 0,
    rating: 4.9, provider: 'Lumosity',
  },
]

const formatIcons: Record<ContentFormat, string> = { video: '🎬', worksheet: '📄', interactive: '⚡', article: '📰', practice: '🎯', quiz: '🧩' }

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('all')
  const [format, setFormat] = useState('all')

  const filtered = allMaterials.filter(m => {
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false
    if (domain !== 'all' && m.domain !== domain) return false
    if (format !== 'all' && m.format !== format) return false
    return true
  })

  const domains = ['all', 'mathematics', 'grammar', 'reading', 'memory', 'reasoning']
  const formats = ['all', 'video', 'interactive', 'worksheet', 'article', 'practice']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Learning Library</h1>
          <p className="text-muted-foreground">Browse all available learning materials across every domain.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" /> {allMaterials.length} total materials
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Materials', value: allMaterials.length, icon: '📚' },
          { label: 'Completed', value: allMaterials.filter(m => m.progressPercent === 100).length, icon: '✅' },
          { label: 'In Progress', value: allMaterials.filter(m => m.progressPercent > 0 && m.progressPercent < 100).length, icon: '▶️' },
          { label: 'Bookmarked', value: allMaterials.filter(m => m.isBookmarked).length, icon: '🔖' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-bold text-xl">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search library..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {domains.map(d => (
              <button key={d} onClick={() => setDomain(d)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', domain === d ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
                {capitalize(d)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {formats.map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', format === f ? 'bg-secondary text-secondary-foreground border border-border' : 'text-muted-foreground hover:text-foreground')}>
                {f === 'all' ? 'All' : `${formatIcons[f as ContentFormat]} ${capitalize(f)}`}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} material{filtered.length !== 1 ? 's' : ''}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              {m.thumbnailUrl && (
                <div className="relative h-32 bg-muted overflow-hidden">
                  <img src={m.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-xl">{formatIcons[m.format]}</span>
                  {m.progressPercent === 100 && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
              )}
              <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{m.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{m.description}</p>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ background: getDomainColor(m.domain) + '20', color: getDomainColor(m.domain) }}>
                    {m.domain}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{m.estimatedDuration}m</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{m.rating}</span>
                </div>
                {m.progressPercent > 0 && m.progressPercent < 100 && (
                  <div className="mb-2">
                    <Progress value={m.progressPercent} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">{m.progressPercent}% complete</p>
                  </div>
                )}
                <Button size="sm" variant={m.progressPercent === 100 ? 'secondary' : 'default'} className="w-full mt-auto">
                  {m.progressPercent === 100 ? '✓ Completed' : m.progressPercent > 0 ? <><Play className="h-3 w-3" /> Continue</> : <><ExternalLink className="h-3 w-3" /> Start</>}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
