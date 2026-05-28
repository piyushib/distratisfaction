'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import type { Category, Task } from '@/lib/store'

const CATEGORY_STYLES: Record<Category, { bg: string; badge: string; timerColor: string; timerTrack: string }> = {
  learn:  { bg: 'bg-parchment',  badge: 'bg-ink/10 text-ink border-ink/20',           timerColor: '#ede9fe', timerTrack: '#ffffff15' },
  absorb: { bg: 'bg-slate-pale', badge: 'bg-slate/10 text-slate-light border-slate/30', timerColor: '#818cf8', timerTrack: '#818cf820' },
  hustle: { bg: 'bg-terra-pale', badge: 'bg-terra/10 text-terra-light border-terra/30', timerColor: '#a78bfa', timerTrack: '#a78bfa20' },
  reset:  { bg: 'bg-sage-pale',  badge: 'bg-sage/10 text-sage border-sage/30',          timerColor: '#e879f9', timerTrack: '#e879f920' },
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

// Mini circular timer for bottom-left of each card
function CardTimer({ duration, active, onExpire }: { duration: number; active: boolean; onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setTimeLeft(duration)
      return
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [active])

  const r = 20
  const circumference = 2 * Math.PI * r
  const progress = timeLeft / duration
  const dashOffset = circumference * (1 - progress)
  const isLow = timeLeft <= 10

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="24" cy="24" r={r}
            fill="none"
            stroke={isLow ? '#e879f9' : '#a78bfa'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className={`relative font-mono text-[10px] tabular-nums font-bold ${isLow ? 'text-sage' : 'text-ink-muted'}`}>
          {active ? formatTime(timeLeft) : formatTime(duration)}
        </span>
      </div>
    </div>
  )
}

export default function FeedPage() {
  const router = useRouter()
  const tasks = useStore((s) => s.tasks)
  const enabledCategories = useStore((s) => s.enabledCategories)
  const setPendingCategory = useStore((s) => s.setPendingCategory)
  const setPendingTask = useStore((s) => s.setPendingTask)
  const setPendingStartedAt = useStore((s) => s.setPendingStartedAt)
  const [mounted, setMounted] = useState(false)
  const [deck, setDeck] = useState<Task[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || tasks.length === 0) return
    const filtered = tasks.filter((t) => enabledCategories.includes(t.category))
    if (filtered.length === 0) return
    const base = [...shuffle(filtered), ...shuffle(filtered), ...shuffle(filtered)]
    setDeck(base.slice(0, 60))
    setCurrentIndex(0)
  }, [mounted, tasks, enabledCategories])

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

  function handleStart(task: Task) {
    setPendingCategory(task.category)
    setPendingTask(task)
    setPendingStartedAt(Date.now())
    router.push('/task')
  }

  function scrollToNext() {
    const next = cardRefs.current[currentIndex + 1]
    if (next) next.scrollIntoView({ behavior: 'smooth' })
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
      {/* Back */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-10 left-7 z-50 font-mono text-[10px] uppercase tracking-widest text-ink-muted/70 hover:text-ink transition-colors"
      >
        ← home
      </button>

      {/* Settings shortcut */}
      <button
        onClick={() => router.push('/settings')}
        className="absolute top-10 right-7 z-50 font-mono text-[10px] uppercase tracking-widest text-ink-muted/70 hover:text-ink transition-colors"
      >
        filter ⊞
      </button>

      {/* Scroll feed */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {deck.map((task, i) => {
          const meta = CATEGORY_META[task.category]
          const styles = CATEGORY_STYLES[task.category]
          const isActive = i === currentIndex
          const duration = task.duration ?? 120

          return (
            <div
              key={`${task.id}-${i}`}
              ref={(el) => { cardRefs.current[i] = el }}
              className={`relative flex h-screen w-full flex-col ${styles.bg}`}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Category badge — top */}
              <div className="px-7 pt-20">
                <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${styles.badge}`}>
                  {meta.emoji} {meta.label}
                </span>
              </div>

              {/* Task text — center */}
              <div className="flex flex-1 flex-col justify-center px-7">
                <p
                  className={`font-serif leading-snug text-ink transition-all duration-500 ${
                    isActive ? 'text-[1.65rem] opacity-100 translate-y-0' : 'text-2xl opacity-50 translate-y-3'
                  }`}
                  style={{ transitionDelay: isActive ? '80ms' : '0ms' }}
                >
                  {task.text}
                </p>
              </div>

              {/* Bottom row: timer (left) + do this button (right) */}
              <div className="px-7 pb-24 flex items-end justify-between gap-4">
                {/* Timer — bottom left */}
                <CardTimer
                  duration={duration}
                  active={isActive}
                  onExpire={scrollToNext}
                />

                {/* CTA — bottom right */}
                <button
                  onClick={() => handleStart(task)}
                  className={`border-2 px-6 py-3 font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'border-terra bg-terra text-parchment hover:bg-terra-dark'
                      : 'border-ink/20 text-ink-muted'
                  }`}
                >
                  do this →
                </button>
              </div>

              {/* Scroll hint on first card */}
              {i === 0 && isActive && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 pointer-events-none">
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
