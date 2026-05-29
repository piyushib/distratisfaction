'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import { COMMUNITY_POOLS, getCurrentMonth, type CommunityPoolId } from '@/lib/community'
import type { Category } from '@/lib/store'

type LiveTask = { id: string; text: string; category: Category; username: string | null; submitted_at: string }

const CATEGORY_COLORS: Record<Category, string> = {
  learn:  'border-ink/20 bg-parchment-dark text-ink',
  absorb: 'border-slate/30 bg-slate-pale text-slate-dark',
  hustle: 'border-terra/20 bg-terra-pale text-terra-dark',
  reset:  'border-sage/30 bg-sage-pale text-sage',
}

export default function CommunityPage() {
  const router = useRouter()
  const addedPools = useStore((s) => s.addedCommunityPools)
  const addCommunityPool = useStore((s) => s.addCommunityPool)
  const removeCommunityPool = useStore((s) => s.removeCommunityPool)
  const addTask = useStore((s) => s.addTask)
  const tasks = useStore((s) => s.tasks)
  const [addedTaskIds, setAddedTaskIds] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<CommunityPoolId | null>(null)
  const [justAdded, setJustAdded] = useState<CommunityPoolId | null>(null)
  const [liveTasks, setLiveTasks] = useState<LiveTask[]>([])
  const [liveLoading, setLiveLoading] = useState(true)

  // Pre-populate which live tasks are already in the user's pool
  useEffect(() => {
    const existingTexts = new Set(tasks.map((t) => t.text))
    setAddedTaskIds((prev) => {
      const next = new Set(prev)
      liveTasks.forEach((t) => { if (existingTexts.has(t.text)) next.add(t.id) })
      return next
    })
  }, [tasks, liveTasks])

  function handleAddLiveTask(task: LiveTask) {
    addTask(task.category, task.text)
    setAddedTaskIds((prev) => new Set(prev).add(task.id))
  }

  useEffect(() => {
    import('@/lib/supabase-queries').then(({ fetchCommunityTasks }) =>
      fetchCommunityTasks()
        .then((tasks) => setLiveTasks(tasks))
        .catch(() => {})
        .finally(() => setLiveLoading(false))
    )
  }, [])

  function handleTogglePool(poolId: CommunityPoolId) {
    if (addedPools.includes(poolId)) {
      removeCommunityPool(poolId)
    } else {
      addCommunityPool(poolId)
      setJustAdded(poolId)
      setTimeout(() => setJustAdded(null), 2000)
    }
  }

  return (
    <main className="flex min-h-screen flex-col pb-24">
      {/* Header */}
      <header className="px-7 pt-12 pb-6 border-b border-ink/10">
        <button
          onClick={() => router.back()}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
        >
          ← back
        </button>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
          {getCurrentMonth()}
        </p>
        <h2 className="mt-1 font-serif text-3xl font-black italic text-ink">
          Community Pools
        </h2>
        <p className="mt-2 font-serif text-sm italic text-ink-light leading-relaxed">
          Tasks written by people like you — add a pool to mix their tasks into your rotation. Pools rotate monthly.
        </p>
      </header>

      {/* Pool cards */}
      <div className="flex flex-col gap-px mt-4 bg-ink/5 border-y border-ink/10">
        {COMMUNITY_POOLS.map((pool) => {
          const isAdded = addedPools.includes(pool.id)
          const isExpanded = expanded === pool.id
          const wasJustAdded = justAdded === pool.id

          // Count tasks per category
          const counts = pool.tasks.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1
            return acc
          }, {} as Record<Category, number>)

          return (
            <div key={pool.id} className="bg-parchment border-b border-ink/5 last:border-0">
              {/* Pool header row */}
              <div className="flex items-start gap-4 px-7 py-5">
                <div className="flex-shrink-0 w-11 h-11 border border-ink/10 flex items-center justify-center text-xl bg-parchment-light">
                  {pool.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-serif text-base font-bold text-ink">{pool.name}</p>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mt-0.5">
                        {pool.tagline}
                      </p>
                    </div>
                    {/* Add/Remove toggle */}
                    <button
                      onClick={() => handleTogglePool(pool.id)}
                      className={`flex-shrink-0 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-150 active:scale-[0.96] ${
                        isAdded
                          ? 'border-ink/20 bg-parchment-dark text-ink-muted hover:border-red-400 hover:text-red-500'
                          : 'border-terra bg-terra text-parchment hover:bg-terra-dark'
                      }`}
                    >
                      {wasJustAdded ? 'added ✓' : isAdded ? 'remove' : 'add'}
                    </button>
                  </div>

                  <p className="mt-2 font-serif text-xs italic text-ink-light leading-relaxed">
                    {pool.description}
                  </p>

                  {/* Category breakdown */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(Object.entries(counts) as [Category, number][]).map(([cat, count]) => (
                      <span
                        key={cat}
                        className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${CATEGORY_COLORS[cat]}`}
                      >
                        {CATEGORY_META[cat].emoji} {count} {CATEGORY_META[cat].label}
                      </span>
                    ))}
                    <span className="font-mono text-[9px] text-ink-muted self-center">
                      {pool.tasks.length} tasks total
                    </span>
                  </div>

                  {/* Preview toggle */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : pool.id)}
                    className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors underline underline-offset-2"
                  >
                    {isExpanded ? 'hide preview ↑' : 'preview tasks ↓'}
                  </button>
                </div>
              </div>

              {/* Task preview */}
              {isExpanded && (
                <div className="mx-7 mb-5 border-l-2 border-terra/30 pl-4 flex flex-col gap-3">
                  {pool.tasks.slice(0, 5).map((task, i) => (
                    <div key={i}>
                      <span className={`inline-block border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest mb-1 ${CATEGORY_COLORS[task.category]}`}>
                        {CATEGORY_META[task.category].emoji} {CATEGORY_META[task.category].label}
                      </span>
                      <p className="font-serif text-xs text-ink-light leading-relaxed">
                        {task.text}
                      </p>
                    </div>
                  ))}
                  {pool.tasks.length > 5 && (
                    <p className="font-mono text-[9px] text-ink-muted">
                      +{pool.tasks.length - 5} more tasks when added
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Live community submissions */}
      <div className="mt-8 px-7">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-1">
          from the community
        </p>
        <p className="font-serif text-xs italic text-ink-light mb-4 leading-relaxed">
          Tasks submitted and approved from Dopa users — shared publicly by people like you.
        </p>

        {liveLoading && (
          <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">loading…</p>
        )}

        {!liveLoading && liveTasks.length === 0 && (
          <div className="border border-ink/10 px-4 py-5 text-center">
            <p className="font-serif text-sm italic text-ink-light">No community submissions yet.</p>
            <p className="mt-1 font-mono text-[9px] text-ink-muted uppercase tracking-widest">
              be the first — share a task from Settings
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {liveTasks.map((task) => {
            const isAdded = addedTaskIds.has(task.id)
            return (
              <div key={task.id} className="border border-ink/10 bg-parchment-light px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest ${CATEGORY_COLORS[task.category]}`}>
                      {CATEGORY_META[task.category].emoji} {CATEGORY_META[task.category].label}
                    </span>
                    {task.username && (
                      <span className="font-mono text-[9px] text-terra">@{task.username}</span>
                    )}
                    <span className="font-mono text-[9px] text-ink-muted">
                      {new Date(task.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <button
                    onClick={() => !isAdded && handleAddLiveTask(task)}
                    className={`flex-shrink-0 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition-all duration-150 ${
                      isAdded
                        ? 'border-ink/10 text-ink-muted cursor-default'
                        : 'border-terra text-terra hover:bg-terra hover:text-parchment active:scale-95'
                    }`}
                  >
                    {isAdded ? '✓ added' : '+ add'}
                  </button>
                </div>
                <p className="font-serif text-sm text-ink leading-relaxed">{task.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="px-7 pt-8 pb-4">
        <p className="font-serif text-xs italic text-ink-muted leading-relaxed">
          Added pools mix into your existing task rotation — they don&apos;t replace your personal tasks.
          Remove any pool at any time. Share your own tasks from the Tasks page.
        </p>
      </div>
    </main>
  )
}
