'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, getRandomTask, CATEGORY_META } from '@/lib/store'
import { CATEGORY_APP_LINKS } from '@/lib/goals'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/utils'

const DURATION = 120

export default function TaskPage() {
  const router = useRouter()
  const {
    tasks,
    pendingCategory,
    pendingTask,
    setPendingTask,
    setPendingStartedAt,
    clearPending,
  } = useStore()

  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [mounted, setMounted] = useState(false)

  // Hydration guard
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pick task and start timer once mounted
  useEffect(() => {
    if (!mounted) return

    if (!pendingCategory) {
      router.replace('/')
      return
    }

    // Pick a task if one isn't already chosen (fresh navigation)
    if (!pendingTask) {
      const task = getRandomTask(tasks, pendingCategory)
      if (!task) {
        // No tasks in pool — send to settings
        router.replace('/settings')
        return
      }
      setPendingTask(task)
      setPendingStartedAt(Date.now())
    }

    setRunning(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // Countdown
  useEffect(() => {
    if (!running) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          router.push('/done')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current!)
  }, [running, router])

  function handleSkip() {
    clearInterval(timerRef.current!)
    router.push('/done')
  }

  if (!mounted || !pendingTask) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">
          finding a task…
        </span>
      </div>
    )
  }

  const meta = CATEGORY_META[pendingTask.category]
  const appLinks = CATEGORY_APP_LINKS[pendingTask.category]
  const progress = ((DURATION - timeLeft) / DURATION) * 100
  const isLast15 = timeLeft <= 15
  const isAbsorb = pendingTask.category === 'absorb'

  return (
    <main className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-7 pt-10">
        <Badge category={pendingTask.category}>
          {meta.emoji} {meta.label}
        </Badge>
        <span
          className={`font-mono text-sm tabular-nums transition-colors ${
            isLast15 ? 'text-terra font-bold' : 'text-ink-muted'
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </header>

      {/* Progress bar */}
      <div className="mt-4 px-0">
        <Progress
          value={progress}
          color={isLast15 ? 'terra' : 'sage'}
          className="h-1"
        />
      </div>

      {/* App link shortcuts */}
      {appLinks && (
        <div className="px-7 pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-2">
            {isAbsorb ? 'open in →' : 'jump to →'}
          </p>
          <div className="flex gap-2">
            {appLinks.map((link) => (
              <a
                key={link.name}
                href={link.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-150 hover:scale-[1.03] active:scale-[0.97] ${
                  isAbsorb
                    ? 'border-slate/30 bg-slate-pale text-slate-dark hover:bg-slate-light/40'
                    : 'border-terra/20 bg-terra-pale text-terra-dark hover:bg-terra-light/30'
                }`}
              >
                <span>{link.emoji}</span>
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Task content */}
      <div className={`flex flex-1 flex-col justify-center px-7 animate-fade-in ${appLinks ? 'py-6' : 'py-10'}`}>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-4">
          {isAbsorb ? 'your session' : 'your task'}
        </p>
        <p className="font-serif text-2xl leading-snug text-ink font-medium">
          {pendingTask.text}
        </p>
      </div>

      {/* Circular time display */}
      <div className="flex justify-center py-4">
        <div
          className={`relative flex h-28 w-28 items-center justify-center rounded-full border-2 transition-colors ${
            isLast15 ? 'border-terra bg-terra/5' : 'border-parchment-dark bg-parchment-light'
          }`}
        >
          {/* SVG countdown ring */}
          <svg
            className="absolute inset-0 -rotate-90"
            width="112"
            height="112"
            viewBox="0 0 112 112"
          >
            <circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              stroke={isLast15 ? '#1e1040' : '#130d20'}
              strokeWidth="4"
            />
            <circle
              cx="56"
              cy="56"
              r="50"
              fill="none"
              stroke={isLast15 ? '#a78bfa' : '#e879f9'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (timeLeft / DURATION)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="text-center z-10">
            <span
              className={`block font-serif text-3xl font-black tabular-nums leading-none ${
                isLast15 ? 'text-terra' : 'text-ink'
              }`}
            >
              {timeLeft}
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-widest text-ink-muted mt-1">
              sec
            </span>
          </div>
        </div>
      </div>

      {/* Skip */}
      <div className="px-7 pb-10 pt-6 text-center">
        <button
          onClick={handleSkip}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors underline underline-offset-4"
        >
          skip this one →
        </button>
        <p className="mt-2 font-serif text-xs italic text-ink-muted">
          skipping is fine. the pause still counts.
        </p>
      </div>
    </main>
  )
}
