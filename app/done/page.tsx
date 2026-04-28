'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function DonePage() {
  const router = useRouter()
  const { pendingTask, logSession, clearPending } = useStore()
  const [note, setNote] = useState('')
  const [logged, setLogged] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !pendingTask) {
      // Nothing pending — went here directly
      router.replace('/')
    }
  }, [mounted, pendingTask, router])

  function handleLog(completed: boolean) {
    logSession(completed, note.trim() || undefined)
    setLogged(true)
  }

  if (!mounted || !pendingTask) {
    return null
  }

  const meta = CATEGORY_META[pendingTask.category]

  if (logged) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-7 text-center animate-fade-in">
        <span className="text-5xl leading-none" role="img" aria-label="celebrate">
          ✦
        </span>
        <h2 className="mt-6 font-serif text-3xl font-black italic text-ink leading-tight">
          Logged.
        </h2>
        <p className="mt-3 font-serif text-base italic text-ink-light leading-relaxed max-w-xs">
          That scroll urge became something real.
        </p>
        <Button
          variant="terra"
          size="lg"
          className="mt-10"
          onClick={() => router.push('/')}
        >
          back to home
        </Button>
        <button
          onClick={() => router.push('/log')}
          className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
        >
          view my log →
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pb-8">
      {/* Header */}
      <header className="px-7 pt-12">
        <Badge category={pendingTask.category}>
          {meta.emoji} {meta.label}
        </Badge>
        <h2 className="mt-4 font-serif text-3xl font-black italic text-ink leading-tight">
          How did<br />that go?
        </h2>
      </header>

      {/* Task recap */}
      <div className="mx-7 mt-6 border-l-2 border-terra/40 pl-5">
        <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1">
          the task
        </p>
        <p className="font-serif text-sm text-ink-light leading-relaxed italic">
          {pendingTask.text}
        </p>
      </div>

      {/* Optional note */}
      <div className="mt-8 px-7">
        <label
          htmlFor="note"
          className="block font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-2"
        >
          a note (optional)
        </label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What came up? What did you notice? Anything at all…"
          rows={4}
          className="text-sm"
        />
        <p className="mt-1.5 font-serif text-[11px] italic text-ink-muted">
          This is just for you. It never leaves your device.
        </p>
      </div>

      {/* Log buttons */}
      <div className="mt-auto px-7 pt-10 space-y-3">
        <Button
          variant="sage"
          size="lg"
          className="w-full"
          onClick={() => handleLog(true)}
        >
          ✓ done — log it
        </Button>
        <Button
          variant="muted"
          size="lg"
          className="w-full"
          onClick={() => handleLog(false)}
        >
          didn&apos;t really do it
        </Button>
        <p className="text-center font-serif text-[11px] italic text-ink-muted pt-1">
          Both log the session. Only the first counts toward your streak.
        </p>
      </div>
    </main>
  )
}
