'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import type { Category, Task } from '@/lib/store'

const CATEGORY_STYLES: Record<Category, { bg: string; accent: string; border: string; badge: string }> = {
  learn:  { bg: 'bg-parchment',       accent: 'text-ink',        border: 'border-ink/20',    badge: 'bg-ink/10 text-ink border-ink/20' },
  absorb: { bg: 'bg-slate-pale',      accent: 'text-slate-light', border: 'border-slate/20',  badge: 'bg-slate/10 text-slate-light border-slate/30' },
  hustle: { bg: 'bg-terra-pale',      accent: 'text-terra-light', border: 'border-terra/20',  badge: 'bg-terra/10 text-terra-light border-terra/30' },
  reset:  { bg: 'bg-sage-pale',       accent: 'text-sage',        border: 'border-sage/20',   badge: 'bg-sage/10 text-sage border-sage/30' },
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FeedPage() {
  const router = useRouter()
  const tasks = useStore((s) => s.tasks)
  const setPendingCategory = useStore((s) => s.setPendingCategory)
  const setPendingTask = useStore((s) => s.setPendingTask)
  const setPendingStartedAt = useStore((s) => s.setPendingStartedAt)
  const [mounted, setMounted] = useState(false)
  const [deck, setDeck] = useState<Task[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || tasks.length === 0) return
    // Build a long shuffled deck (repeat 3x so you can scroll a while)
    const shuffled = shuffle([...shuffle(tasks), ...shuffle(tasks), ...shuffle(tasks)])
    setDeck(shuffled.slice(0, 60))
  }, [mounted, tasks])

  // Track which card is visible via IntersectionObserver
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
      { threshold: 0.6 }
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

  if (!mounted || deck.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">loading…</span>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-parchment">
      {/* Back button — always on top */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-10 left-7 z-50 font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
      >
        ← home
      </button>

      {/* Progress dots */}
      <div className="absolute top-10 right-7 z-50 flex flex-col gap-1">
        {deck.slice(Math.max(0, currentIndex - 2), currentIndex + 5).map((_, i) => {
          const absIdx = Math.max(0, currentIndex - 2) + i
          return (
            <div
              key={absIdx}
              className={`w-1 rounded-full transition-all duration-300 ${
                absIdx === currentIndex ? 'h-4 bg-terra' : 'h-1 bg-ink/20'
              }`}
            />
          )
        })}
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}
      >
        {deck.map((task, i) => {
          const meta = CATEGORY_META[task.category]
          const styles = CATEGORY_STYLES[task.category]
          const isActive = i === currentIndex

          return (
            <div
              key={`${task.id}-${i}`}
              ref={(el) => { cardRefs.current[i] = el }}
              className={`relative flex h-screen w-full flex-col ${styles.bg}`}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Category label */}
              <div className="px-7 pt-24 pb-0">
                <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${styles.badge}`}>
                  {meta.emoji} {meta.label}
                </span>
              </div>

              {/* Task text — center of card */}
              <div className="flex flex-1 flex-col justify-center px-7">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-4">
                  2-minute task
                </p>
                <p
                  className={`font-serif leading-snug text-ink transition-all duration-500 ${
                    isActive ? 'text-3xl opacity-100 translate-y-0' : 'text-2xl opacity-60 translate-y-2'
                  }`}
                  style={{ transitionDelay: isActive ? '100ms' : '0ms' }}
                >
                  {task.text}
                </p>
              </div>

              {/* CTA */}
              <div className="px-7 pb-28">
                <button
                  onClick={() => handleStart(task)}
                  className={`w-full border-2 py-5 font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? `border-terra bg-terra text-parchment hover:bg-terra-dark`
                      : `border-ink/20 text-ink-muted`
                  }`}
                >
                  do this →
                </button>

                {/* Scroll hint */}
                <div className="mt-5 flex flex-col items-center gap-1 opacity-40">
                  <div className="w-px h-8 bg-ink/30 animate-pulse" />
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                    scroll for next
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
