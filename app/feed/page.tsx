'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import type { Category, Task, Session } from '@/lib/store'

const CATEGORY_STYLES: Record<Category, { bg: string; badge: string }> = {
  learn:  { bg: 'bg-parchment',  badge: 'bg-ink/10 text-ink border-ink/20' },
  absorb: { bg: 'bg-slate-pale', badge: 'bg-slate/10 text-slate-light border-slate/30' },
  hustle: { bg: 'bg-terra-pale', badge: 'bg-terra/10 text-terra-light border-terra/30' },
  reset:  { bg: 'bg-sage-pale',  badge: 'bg-sage/10 text-sage border-sage/30' },
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`
}

function CircleTimer({
  duration,
  running,
  onExpire,
}: {
  duration: number
  running: boolean
  onExpire: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  // Reset when duration changes (different card) or when not running
  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!running) {
      setTimeLeft(duration)
      return
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [running, duration])

  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ * (timeLeft / duration)
  const isLow = running && timeLeft <= 10

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={r}
          fill="none"
          stroke={isLow ? '#f0a8f8' : '#b89eff'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={running ? circ - offset : circ}
          style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none' }}
        />
      </svg>
      <span className={`relative font-mono text-[11px] tabular-nums font-bold leading-none ${
        isLow ? 'text-sage' : running ? 'text-ink' : 'text-ink-muted'
      }`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  )
}

export default function FeedPage() {
  const router = useRouter()
  const tasks = useStore((s) => s.tasks)
  const enabledCategories = useStore((s) => s.enabledCategories)
  const addSessionDirect = useStore((s) => s.addSessionDirect)
  const addProductivitySeconds = useStore((s) => s.addProductivitySeconds)
  const productivitySeconds = useStore((s) => s.productivitySeconds)

  const [mounted, setMounted] = useState(false)
  const [deck, setDeck] = useState<Task[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  // Which card has active timer (user pressed "do this")
  const [runningIndex, setRunningIndex] = useState<number | null>(null)
  // Which card just expired (show done/skip)
  const [expiredIndex, setExpiredIndex] = useState<number | null>(null)
  // Per-card start timestamps
  const startedAtRef = useRef<Record<number, number>>({})
  // Completion counts from Supabase
  const [stats, setStats] = useState<Record<string, number>>({})

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Build deck
  useEffect(() => {
    if (!mounted || tasks.length === 0) return
    const filtered = tasks.filter((t) => enabledCategories.includes(t.category))
    if (filtered.length === 0) return
    const base = [...shuffle(filtered), ...shuffle(filtered), ...shuffle(filtered)]
    setDeck(base.slice(0, 60))
    setCurrentIndex(0)
    setRunningIndex(null)
    setExpiredIndex(null)
  }, [mounted, tasks, enabledCategories])

  // Fetch completion stats
  useEffect(() => {
    if (!mounted) return
    import('@/lib/supabase-queries').then(({ fetchTaskStats }) =>
      fetchTaskStats().then(setStats).catch(() => {})
    )
  }, [mounted])

  // Track visible card via IntersectionObserver
  useEffect(() => {
    if (deck.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) setCurrentIndex(idx)
          }
        })
      },
      { threshold: 0.7 }
    )
    cardRefs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [deck])

  // When user scrolls away from a running card, reset it
  useEffect(() => {
    if (runningIndex !== null && runningIndex !== currentIndex) {
      setRunningIndex(null)
      setExpiredIndex(null)
    }
  }, [currentIndex])

  function scrollToNext(fromIndex: number) {
    const next = cardRefs.current[fromIndex + 1]
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  function handleDoThis(i: number) {
    startedAtRef.current[i] = Date.now()
    setRunningIndex(i)
    setExpiredIndex(null)
  }

  function handleExpire(i: number) {
    setRunningIndex(null)
    setExpiredIndex(i)
  }

  async function handleDone(task: Task, i: number) {
    const session: Session = {
      id: crypto.randomUUID(),
      taskId: task.id,
      taskText: task.text,
      category: task.category,
      completed: true,
      startedAt: startedAtRef.current[i] ?? Date.now() - (task.duration ?? 120) * 1000,
      endedAt: Date.now(),
    }
    addSessionDirect(session)
    // Add time to productivity bank
    addProductivitySeconds(task.duration ?? 120)
    // Increment community counter
    import('@/lib/supabase-queries').then(({ incrementTaskCompletion }) => {
      incrementTaskCompletion(task.id).catch(() => {})
      setStats((prev) => ({ ...prev, [task.id]: (prev[task.id] ?? 0) + 1 }))
    })

    setExpiredIndex(null)
    scrollToNext(i)
  }

  function handleSkip(i: number) {
    setExpiredIndex(null)
    setRunningIndex(null)
    scrollToNext(i)
  }

  if (!mounted || deck.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">loading…</span>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-parchment">
      {/* Bottom taskbar */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 flex border-t border-ink/10 bg-parchment/95 backdrop-blur-sm">
        <button
          onClick={() => router.push('/feed')}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-terra"
        >
          <span className="text-lg leading-none">◉</span>
          <span className="font-mono text-[9px] uppercase tracking-widest">Home</span>
        </button>
        <button
          onClick={() => router.push('/settings')}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-ink-muted hover:text-ink transition-colors"
        >
          <span className="text-lg leading-none">⊞</span>
          <span className="font-mono text-[9px] uppercase tracking-widest">Settings</span>
        </button>
        <button
          onClick={() => router.push('/rewards')}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-ink-muted hover:text-ink transition-colors relative"
        >
          <span className="text-lg leading-none">✦</span>
          <span className="font-mono text-[9px] uppercase tracking-widest">Rewards</span>
          {productivitySeconds > 0 && (
            <span className="absolute top-2 right-[calc(50%-14px)] w-1.5 h-1.5 rounded-full bg-terra" />
          )}
        </button>
      </nav>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {deck.map((task, i) => {
          const meta = CATEGORY_META[task.category]
          const styles = CATEGORY_STYLES[task.category]
          const isVisible = i === currentIndex
          const isRunning = runningIndex === i
          const isExpired = expiredIndex === i
          const duration = task.duration ?? 120
          const completions = stats[task.id] ?? 0

          return (
            <div
              key={`${task.id}-${i}`}
              ref={(el) => { cardRefs.current[i] = el }}
              className={`relative flex h-screen w-full flex-col ${styles.bg}`}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Category badge */}
              <div className="px-7 pt-20">
                <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${styles.badge}`}>
                  {meta.emoji} {meta.label}
                </span>
              </div>

              {/* Task text */}
              <div className="flex flex-1 flex-col justify-center px-7">
                <p
                  className={`font-serif leading-snug text-ink transition-all duration-500 ${
                    isVisible ? 'text-[1.65rem] opacity-100 translate-y-0' : 'text-2xl opacity-40 translate-y-3'
                  }`}
                  style={{ transitionDelay: isVisible ? '80ms' : '0ms' }}
                >
                  {task.text}
                </p>

                {/* Completion count */}
                {completions > 0 && (
                  <p className={`mt-4 font-mono text-[10px] text-ink-muted transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {completions.toLocaleString()} {completions === 1 ? 'person' : 'people'} did this
                  </p>
                )}
              </div>

              {/* Bottom bar */}
              <div className="px-7 pb-20">
                {isExpired ? (
                  /* Done / Skip prompt */
                  <div className="flex items-center gap-3 animate-fade-in">
                    <button
                      onClick={() => handleDone(task, i)}
                      className="flex-1 border-2 border-terra bg-terra py-3 font-mono text-[11px] uppercase tracking-widest text-parchment hover:bg-terra-dark transition-colors"
                    >
                      ✓ done
                    </button>
                    <button
                      onClick={() => handleSkip(i)}
                      className="border-2 border-ink/20 px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-ink/40 transition-colors"
                    >
                      skip
                    </button>
                  </div>
                ) : (
                  <div className="flex items-end justify-between gap-4">
                    {/* Timer — bottom left */}
                    <CircleTimer
                      duration={duration}
                      running={isRunning}
                      onExpire={() => handleExpire(i)}
                    />

                    {/* CTA — bottom right */}
                    {isRunning ? (
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted animate-pulse">
                        in progress…
                      </p>
                    ) : (
                      <button
                        onClick={() => handleDoThis(i)}
                        className={`border-2 px-6 py-3 font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${
                          isVisible
                            ? 'border-terra bg-terra text-parchment hover:bg-terra-dark'
                            : 'border-ink/20 text-ink-muted'
                        }`}
                      >
                        do this →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Scroll hint — first card only */}
              {i === 0 && isVisible && !isRunning && !isExpired && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-25 pointer-events-none">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">scroll</p>
                  <div className="w-px h-6 bg-ink/30 animate-pulse" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
