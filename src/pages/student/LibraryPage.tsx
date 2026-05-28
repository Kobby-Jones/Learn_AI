import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Library, Search, Filter, Bookmark, BookmarkCheck, Clock, Star, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/primitives'
import { cn, capitalize } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { recommendationsApi, queryKeys } from '@/api'

const formatIcons: Record<string, string> = {
  video: '🎬', worksheet: '📄', interactive: '⚡', article: '📰', practice: '🎯', quiz: '🧩',
}

export default function LibraryPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState<string>('all')

  const filters = domainFilter !== 'all' ? { domain: domainFilter } : undefined
  const { data: materials = [], isLoading } = useQuery({
    queryKey: queryKeys.library(filters),
    queryFn: () => recommendationsApi.library(filters),
  })

  const bookmark = useMutation({
    mutationFn: (id: string) => recommendationsApi.toggleBookmark(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['library'] })
      qc.invalidateQueries({ queryKey: queryKeys.recommendations })
      toast.success(res.bookmarked ? 'Bookmarked!' : 'Removed bookmark')
    },
  })

  const domains = ['all', 'mathematics', 'grammar', 'reading', 'memory', 'reasoning']
  const filtered = materials.filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-2">
          <Library className="h-7 w-7 text-brand-500" /> Resource Library
        </h1>
        <p className="text-muted-foreground">Browse our complete collection of learning materials.</p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the library..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Filter className="h-4 w-4 text-muted-foreground" />
          {domains.map(d => (
            <button key={d} onClick={() => setDomainFilter(d)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', domainFilter === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
              {capitalize(d)}
            </button>
          ))}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} resource{filtered.length !== 1 ? 's' : ''}</p>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">{formatIcons[m.format] || '📚'}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">{m.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>
                    </div>
                    <button onClick={() => bookmark.mutate(m.id)}
                      className={cn('shrink-0 transition-colors', m.isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500')}>
                      {m.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{m.domain}</span>
                    <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{m.estimatedDuration}m</span>
                    {m.rating && <span className="text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{m.rating}</span>}
                  </div>
                  {m.progressPercent > 0 && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Progress</span><span>{m.progressPercent}%</span></div>
                      <Progress value={m.progressPercent} className="h-1.5" />
                    </div>
                  )}
                  <Button size="sm" variant="outline" className="w-full"
                    onClick={() => m.url && m.url !== '#' ? window.open(m.url, '_blank', 'noopener,noreferrer') : toast.info('Coming soon', 'External link not configured.')}>
                    <ExternalLink className="h-3 w-3" /> Open
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium">Nothing matches your filters</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different domain or search term</p>
        </div>
      )}
    </div>
  )
}
