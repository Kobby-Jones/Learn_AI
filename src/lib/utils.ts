import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelative(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return formatDate(date)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    dyslexia: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400',
    dyscalculia: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    reading: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400',
    memory: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400',
    reasoning: 'text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400',
    none: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  }
  const key = Object.keys(map).find(k => difficulty.toLowerCase().includes(k)) || 'none'
  return map[key]
}

export function getDomainColor(domain: string): string {
  const map: Record<string, string> = {
    mathematics: '#f59e0b',
    grammar: '#8b5cf6',
    reading: '#3b82f6',
    memory: '#14b8a6',
    reasoning: '#f43f5e',
  }
  return map[domain.toLowerCase()] || '#6b7280'
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}
