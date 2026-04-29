'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, getTodaySessions, getStreak } from '@/lib/store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

export default function HomePage() {
  const router = useRouter()
  const sessions = useStore((s) => s.sessions)
  const hasOnboarded = useStore((s) => s.hasOnboarded)
  const hasSeenWelcome = useStore((s) => s.hasSeenWelcome)
  const [mounted, setMounted] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Wait for hydration before checking onboarding — avoids false redirect on first render
  useEffect(() => {
    if (!mounted) return
    if (!hasOnboarded) {
      router.replace(hasSeenWelcome ? '/onboarding' : '/welcome')
      return
    }
    // Check if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
    }
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [mounted, hasOnboarded])

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setInstallPrompt(null)
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">loading…</span>
      </div>
    )
  }

  const todaySessions = getTodaySessions(sessions)
  const todayCompleted = todaySessions.filter((s) => s.completed)
  const streak = getStreak(sessions)
  const minutesReclaimed = todaySessions.length // each task ≈ 1 minute

  return (
    <main className="flex min-h-screen flex-col pb-20">
      {/* Header */}
      <header className="px-7 pt-12">
        <h1 className="font-serif text-4xl font-black italic leading-none text-ink">
          Dopa
        </h1>
        <p className="mt-2 font-serif text-sm italic text-ink-light leading-relaxed">
          Turn the urge to scroll into&nbsp;2 minutes of progress.
        </p>
      </header>

      {/* Main CTA */}
      <div className="flex flex-1 flex-col items-center justify-center px-7 py-10">
        <button
          onClick={() => router.push('/picker')}
          className="group relative w-full animate-breathe rounded-none border-2 border-terra bg-terra px-8 py-9 text-left text-parchment transition-all duration-200 hover:bg-terra-dark active:scale-[0.97]"
          aria-label="I'm getting distracted — start a micro task"
        >
          <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-terra-light">
            right now, I feel
          </span>
          <span className="mt-2 block font-serif text-3xl font-black italic leading-tight">
            I&apos;m getting<br />distracted.
          </span>
          <span className="mt-4 block font-mono text-xs text-terra-light">
            turn it into something →
          </span>
        </button>
      </div>

      {/* Daily stats */}
      <div className="px-7">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">
          today
        </p>
        <div className="grid grid-cols-3 gap-px border border-ink/10 bg-ink/10">
          <StatTile
            value={todaySessions.length}
            label="turned"
            sub="distractions"
          />
          <StatTile
            value={minutesReclaimed}
            label="minutes"
            sub="reclaimed"
          />
          <StatTile
            value={streak}
            label={streak === 1 ? 'day' : 'days'}
            sub="streak"
            highlight={streak >= 3}
          />
        </div>

        {sessions.length > 0 && (
          <div className="mt-4 border-l-2 border-terra/40 pl-4">
            <p className="font-mono text-[10px] text-ink-muted">
              {sessions.length} total session{sessions.length !== 1 ? 's' : ''} ·{' '}
              {Math.round(
                (sessions.filter((s) => s.completed).length / sessions.length) * 100
              )}
              % completion rate
            </p>
          </div>
        )}
      </div>

      {/* Install as app banner */}
      {!installed && installPrompt && (
        <div className="mx-7 mt-4 border border-ink/10 bg-parchment-light px-4 py-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-ink-muted leading-relaxed">
            install as a standalone app — data always saved locally
          </p>
          <button
            onClick={handleInstall}
            className="flex-shrink-0 font-mono text-[10px] uppercase tracking-widest text-terra hover:text-terra-dark underline underline-offset-2 transition-colors"
          >
            install
          </button>
        </div>
      )}

      {/* Gentle footer note */}
      <div className="mt-auto px-7 pb-6 pt-6">
        <p className="font-serif text-xs italic text-ink-muted leading-relaxed">
          No shame in skips. Every tap is a win over the scroll.
        </p>
      </div>
    </main>
  )
}

function StatTile({
  value,
  label,
  sub,
  highlight = false,
}: {
  value: number
  label: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col items-center bg-parchment px-3 py-5 text-center">
      <span
        className={`font-serif text-4xl font-black leading-none ${
          highlight ? 'text-terra' : 'text-ink'
        }`}
      >
        {value}
      </span>
      <span className="mt-1 font-serif text-sm font-medium text-ink">{label}</span>
      <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-ink-muted">
        {sub}
      </span>
    </div>
  )
}
