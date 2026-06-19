// src/lib/grades.ts
// Single source of truth for grades/classes on the frontend.
// Keep in sync with the backend copy at backend/utils/grades.py
// (the API also exposes these at GET /api/meta/grades).

export interface Grade {
  value: string
  label: string
}

export const GRADES: Grade[] = [
  { value: 'basic4', label: 'Basic 4' },
  { value: 'basic5', label: 'Basic 5' },
  { value: 'basic6', label: 'Basic 6' },
  { value: 'jhs1', label: 'JHS 1' },
  { value: 'jhs2', label: 'JHS 2' },
  { value: 'jhs3', label: 'JHS 3' },
]

export const GRADE_VALUES = GRADES.map(g => g.value)

const LABELS: Record<string, string> = Object.fromEntries(GRADES.map(g => [g.value, g.label]))

/** Human label for a grade code, falling back to the raw value. */
export function gradeLabel(value?: string | null): string {
  if (!value) return ''
  return LABELS[value] ?? value
}

/** Sort key for a grade code (lowest grade first). */
export function gradeOrder(value?: string | null): number {
  const i = value ? GRADE_VALUES.indexOf(value) : -1
  return i === -1 ? 99 : i
}
