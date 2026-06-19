import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Eye, Palette, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label, Switch } from '@/components/ui/primitives'
import { Avatar } from '@/components/ui/primitives'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { gradeLabel } from '@/lib/grades'
import { authApi } from '@/api/auth'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { theme, setTheme, dyslexiaMode, toggleDyslexia, highContrast, toggleHighContrast, fontSize, setFontSize, reducedMotion, toggleReducedMotion } = useUIStore()
  const [name, setName] = useState(user?.name || '')
  const email = user?.email || ''
  const [saving, setSaving] = useState(false)

  if (!user) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await authApi.updateProfile({
        name,
        preferences: {
          theme,
          dyslexiaMode,
          highContrast,
          reducedMotion,
          fontSize,
        },
      })
      updateUser(updated)
      toast.success('Profile updated', 'Your changes have been saved.')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save'
      toast.error('Save failed', msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and accessibility preferences.</p>
      </div>

      {/* Profile info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Profile Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} size="xl" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role} account</p>
                <button className="text-sm text-brand-600 hover:text-brand-700 mt-1">Change avatar</button>
              </div>
            </div>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} disabled className="mt-1.5 opacity-60" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed. Contact your administrator if needed.</p>
            </div>
            <div>
              <Label htmlFor="class">Class / grade</Label>
              <Input id="class" value={gradeLabel(user.grade) || 'Not assigned'} disabled className="mt-1.5 opacity-60" />
              <p className="text-xs text-muted-foreground mt-1">Your class determines which questions you receive. Contact your teacher to change it.</p>
            </div>
            <Button onClick={handleSave} variant="gradient" loading={saving}><Save className="h-4 w-4" /> Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Appearance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Theme</Label>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map(t => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={cn('flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-all', theme === t ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300' : 'border-border hover:border-brand-300')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Font Size</Label>
              <div className="flex gap-2">
                {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                  <button key={s} onClick={() => setFontSize(s)}
                    className={cn('flex-1 py-2 rounded-lg border text-sm font-medium transition-all', fontSize === s ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300' : 'border-border hover:border-brand-300')}>
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Accessibility */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Accessibility</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'dyslexia', label: 'Dyslexia-friendly mode', desc: 'Uses a typeface and spacing optimised for readers with dyslexia', checked: dyslexiaMode, onChange: toggleDyslexia },
              { id: 'contrast', label: 'High contrast mode', desc: 'Increases colour contrast for improved readability', checked: highContrast, onChange: toggleHighContrast },
              { id: 'motion', label: 'Reduced motion', desc: 'Minimises animations and transitions throughout the interface', checked: reducedMotion, onChange: toggleReducedMotion },
            ].map(s => (
              <div key={s.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
                <Switch id={s.id} checked={s.checked} onCheckedChange={s.onChange} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
