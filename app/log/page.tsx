'use client'

import { useEffect, useState, useMemo } from 'react'
import { useStore, CATEGORY_META, getLast7DaysData } from '@/lib/store'
import type { Category, Session } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate, formatTimeOfDay } from '@/lib/utils'
import { StatsChart } from '@/components/stats-chart'

type View = 'daily' | 'weekly'
type Filter = 'all' | Category

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',    label: 'All' },
  { id: 'learn',  label: '📖 Learn' },
  { id: 'absorb', label: '📚 Absorb' },
  { id: 'hustle', label: '⚡ Hustle' },
  { id: 'reset',  label: '🌬️ Reset' },
]

export default function LogPage() {
  const sessions = useStore((s) => s.sessions)
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<View>('daily')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'all') return sessions
    return sessions.filter((s) => s.category === filter)
  }, [sessions, filter])

  // Group by date for daily view
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    for (const s of filtered) {
      const key = formatDate(s.startedAt)
      if (!groups[key]) groups[key] = []
      groups[key].push(s)
    }
    return groups
  }, [filtered])

  const chartData = useMemo(() => getLast7DaysData(sessions), [sessions])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">
          loading…
        </span>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pb-24">
      {/* Header */}
      <header className="px-7 pt-12 pb-6 border-b border-ink/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
          your history
        </p>
        <h2 className="mt-1 font-serif text-3xl font-black italic text-ink">
          Insights
        </h2>

        {sessions.length > 0 && (
          <div className="mt-3 flex gap-4 font-mono text-xs text-ink-muted">
            <span>{sessions.length} total</span>
            <span>·</span>
            <span>
              {Math.round(
                (sessions.filter((s) => s.completed).length / sessions.length) * 100
              )}
              % done
            </span>
            <span>·</span>
            <span>{sessions.length} min reclaimed</span>
          </div>
        )}
      </header>

      {/* 7-day chart */}
      {sessions.length > 0 && (
        <div className="px-7 pt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-3">
            last 7 days
          </p>
          <StatsChart data={chartData} />
        </div>
      )}

      {/* View toggle */}
      {sessions.length > 0 && (
        <div className="px-7 pt-6 flex gap-px border-b border-ink/10 pb-0">
          {(['daily', 'weekly'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-4 py-2 font-mono text-[10px] uppercase tracking-widest border-b-2 transition-colors',
                view === v
                  ? 'border-terra text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* Category filter */}
      {sessions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-7 py-4 scrollbar-none">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                'flex-shrink-0 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors',
                filter === id
                  ? 'border-ink bg-ink text-parchment'
                  : 'border-ink/20 text-ink-muted hover:border-ink/40 hover:text-ink'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <EmptyLog />
      ) : view === 'daily' ? (
        <div className="px-7 space-y-6 pt-2">
          {Object.entries(grouped).map(([date, daySessions]) => (
            <div key={date}>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-3 sticky top-0 bg-parchment py-1">
                {date}
              </p>
              <div className="space-y-px border border-ink/10 bg-ink/10">
                {daySessions.map((s) => (
                  <SessionRow key={s.id} session={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <WeeklyView sessions={filtered} />
      )}
    </main>
  )
}

function SessionRow({ session }: { session: Session }) {
  const meta = CATEGORY_META[session.category]
  return (
    <div
      className={cn(
        'bg-parchment px-4 py-4 border-l-2',
        session.completed ? 'border-sage' : 'border-parchment-deeper'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-serif text-sm text-ink leading-snug line-clamp-2">
            {session.taskText}
          </p>
          {session.note && (
            <p className="mt-1.5 font-serif text-xs italic text-ink-light leading-relaxed">
              &ldquo;{session.note}&rdquo;
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <Badge category={session.category}>
            {meta.emoji}
          </Badge>
          <span
            className={`font-mono text-[9px] uppercase tracking-widest ${
              session.completed ? 'text-sage' : 'text-ink-muted'
            }`}
          >
            {session.completed ? 'done' : 'skipped'}
          </span>
        </div>
      </div>
      <p className="mt-2 font-mono text-[9px] text-ink-muted">
        {formatTimeOfDay(session.startedAt)}
      </p>
    </div>
  )
}

function WeeklyView({ sessions }: { sessions: Session[] }) {
  // Group by week
  const grouped = useMemo(() => {
    const groups: Record<string, typeof sessions> = {}
    for (const s of sessions) {
      const d = new Date(s.startedAt)
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay())
      weekStart.setHours(0, 0, 0, 0)
      const key = formatDate(weekStart.getTime())
      if (!groups[key]) groups[key] = []
      groups[key].push(s)
    }
    return groups
  }, [sessions])

  return (
    <div className="px-7 pt-2 space-y-6">
      {Object.entries(grouped).map(([weekStart, wSessions]) => (
        <div key={weekStart}>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-3 sticky top-0 bg-parchment py-1">
            Week of {weekStart}
          </p>
          <div className="border border-ink/10 bg-ink/10">
            <div className="bg-parchment px-4 py-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="block font-serif text-2xl font-black text-ink">{wSessions.length}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">sessions</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-black text-sage">
                  {wSessions.filter((s) => s.completed).length}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">completed</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-black text-terra">{wSessions.length}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">min saved</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyLog() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-7 py-16 text-center">
      <span className="text-4xl leading-none">◎</span>
      <h3 className="mt-4 font-serif text-xl font-black italic text-ink">
        Nothing here yet.
      </h3>
      <p className="mt-2 font-serif text-sm italic text-ink-light leading-relaxed max-w-xs">
        Every session will show up here. Start on the home screen whenever the scroll urge hits.
      </p>
    </div>
  )
}
