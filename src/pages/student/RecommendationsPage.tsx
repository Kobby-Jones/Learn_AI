import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Bookmark, BookmarkCheck, Clock, Star, ExternalLink, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/primitives'
import { cn, capitalize } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { recommendationsApi, queryKeys } from '@/api'
import type { LearningMaterial, ContentFormat } from '@/types'

const formatIcons: Record<ContentFormat, string> = {
  video: '🎬', worksheet: '📄', interactive: '⚡', article: '📰', practice: '🎯', quiz: '🧩',
}

const domainColors: Record<string, string> = {
  mathematics: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  grammar:     'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400',
  reading:     'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400',
  memory:      'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
  reasoning:   'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
}

function MaterialCard({ material, onBookmark }: { material: LearningMaterial; onBookmark: (id: string) => void }) {
  const score = Math.round(material.recommendationScore * 100)
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {material.thumbnailUrl && (
          <div className="relative h-36 bg-muted overflow-hidden">
            <img src={material.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-2 left-2 text-2xl">{formatIcons[material.format]}</span>
            <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{material.format}</span>
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm leading-tight">{material.title}</h3>
            <button onClick={() => onBookmark(material.id)}
              className={cn('shrink-0 transition-colors', material.isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500')}>
              {material.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{material.description}</p>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', domainColors[material.domain] || 'bg-muted text-muted-foreground')}>
              {material.domain}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{material.estimatedDuration}m</span>
            {material.rating && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{material.rating}
              </span>
            )}
          </div>
          {material.progressPercent > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span><span>{material.progressPercent}%</span>
              </div>
              <Progress value={material.progressPercent} className="h-1.5" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{score}% match</span>
          </div>
          <Button size="sm" variant={material.progressPercent > 0 ? 'outline' : 'default'} className="w-full mt-3"
            onClick={() => {
              if (material.url && material.url !== '#') window.open(material.url, '_blank', 'noopener,noreferrer')
              else toast.info('Coming soon', 'External link not configured for this item.')
            }}>
            {material.progressPercent > 0 ? <><Play className="h-3 w-3" />Continue</> : <><ExternalLink className="h-3 w-3" />Start Learning</>}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function RecommendationsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [formatFilter, setFormatFilter] = useState<string>('all')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.recommendations,
    queryFn: recommendationsApi.list,
  })

  const bookmark = useMutation({
    mutationFn: (id: string) => recommendationsApi.toggleBookmark(id),
    onSuccess: (res, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.recommendations })
      qc.invalidateQueries({ queryKey: ['library'] })
      toast.success(res.bookmarked ? 'Bookmarked!' : 'Removed bookmark')
    },
    onError: (e: Error) => toast.error('Action failed', e.message),
  })

  const materials = data?.materials || []
  const domains   = ['all', 'reading', 'reasoning', 'memory', 'mathematics', 'grammar']
  const formats   = ['all', 'video', 'interactive', 'worksheet', 'article', 'practice']

  const filtered = materials.filter(m => {
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false
    if (domainFilter !== 'all' && m.domain !== domainFilter) return false
    if (formatFilter !== 'all' && m.format !== formatFilter) return false
    if (bookmarkedOnly && !m.isBookmarked) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Your Recommendations</h1>
        <p className="text-muted-foreground">Personalized learning materials based on your assessment results.</p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <button key={d} onClick={() => setDomainFilter(d)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', domainFilter === d ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
                {capitalize(d)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {formats.map(f => (
              <button key={f} onClick={() => setFormatFilter(f)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', formatFilter === f ? 'bg-secondary text-secondary-foreground border border-border' : 'text-muted-foreground hover:text-foreground')}>
                {f === 'all' ? 'All formats' : `${formatIcons[f as ContentFormat]} ${capitalize(f)}`}
              </button>
            ))}
          </div>
          <button onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all', bookmarkedOnly ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'bg-muted text-muted-foreground hover:text-foreground')}>
            <Bookmark className="h-3 w-3" /> Bookmarked
          </button>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} material{filtered.length !== 1 ? 's' : ''} found</p>

      {isLoading && (
        <div className="text-center py-16">
          <div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        </div>
      )}

      {!isLoading && materials.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">No recommendations yet</p>
          <p className="text-sm text-muted-foreground mt-1">Take an assessment to receive personalised recommendations.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(m => <MaterialCard key={m.id} material={m} onBookmark={id => bookmark.mutate(id)} />)}
      </div>

      {!isLoading && materials.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">No materials match your filters</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
