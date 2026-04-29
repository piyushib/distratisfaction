'use client'

import { useState, useEffect, useCallback } from 'react'
import { CATEGORY_META } from '@/lib/store'
import type { Category } from '@/lib/store'

type Task = {
  id: string
  text: string
  category: Category
  note: string | null
  submitted_at: string
  anonymous_user_id: string
}

const CATEGORY_COLORS: Record<Category, string> = {
  learn:  'border-ink/20 bg-parchment-dark text-ink',
  absorb: 'border-slate/30 bg-slate-pale text-slate-dark',
  hustle: 'border-terra/20 bg-terra-pale text-terra-dark',
  reset:  'border-sage/30 bg-sage-pale text-sage',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTasks = useCallback(async (pw: string) => {
    setLoading(true)
    const res = await fetch('/api/admin/tasks', {
      headers: { 'x-admin-password': pw },
    })
    if (res.status === 401) {
      setError('Wrong password')
      setAuthed(false)
      setLoading(false)
      return
    }
    const data = await res.json()
    setTasks(data.tasks ?? [])
    setAuthed(true)
    setLoading(false)
  }, [])

  async function handleDecision(id: string, status: 'approved' | 'rejected') {
    await fetch('/api/admin/tasks', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ id, status }),
    })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-7">
        <h1 className="font-serif text-3xl font-black italic text-ink mb-6">Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchTasks(password)}
          placeholder="password"
          className="w-full max-w-xs border border-ink/20 bg-parchment p-3 font-mono text-sm text-ink focus:border-terra focus:outline-none"
        />
        {error && <p className="mt-2 font-mono text-[10px] text-terra">{error}</p>}
        <button
          onClick={() => fetchTasks(password)}
          className="mt-3 border-2 border-terra bg-terra px-6 py-2 font-mono text-[10px] uppercase tracking-widest text-parchment hover:bg-terra-dark transition-colors"
        >
          enter
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pb-10">
      <header className="px-7 pt-12 pb-6 border-b border-ink/10">
        <h1 className="font-serif text-3xl font-black italic text-ink">Review Queue</h1>
        <p className="mt-1 font-mono text-[10px] text-ink-muted uppercase tracking-widest">
          {tasks.length} pending
        </p>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <span className="font-mono text-xs text-ink-muted uppercase tracking-widest">loading…</span>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="px-7 py-16 text-center">
          <p className="font-serif text-lg italic text-ink-light">Queue is empty.</p>
          <p className="mt-1 font-mono text-[10px] text-ink-muted uppercase tracking-widest">
            nothing to review
          </p>
        </div>
      )}

      <div className="flex flex-col gap-px mt-4 bg-ink/5 border-y border-ink/10 mx-7">
        {tasks.map((task) => (
          <div key={task.id} className="bg-parchment p-5 border-b border-ink/5 last:border-0">
            {/* Category badge */}
            <span className={`inline-block border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest mb-2 ${CATEGORY_COLORS[task.category]}`}>
              {CATEGORY_META[task.category].emoji} {CATEGORY_META[task.category].label}
            </span>

            {/* Task text */}
            <p className="font-serif text-sm text-ink leading-relaxed">{task.text}</p>

            {/* Note */}
            {task.note && (
              <p className="mt-2 font-serif text-xs italic text-ink-muted border-l-2 border-ink/20 pl-3">
                "{task.note}"
              </p>
            )}

            {/* Meta */}
            <p className="mt-2 font-mono text-[9px] text-ink-muted">
              {new Date(task.submitted_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
              {' · '}anon {task.anonymous_user_id.slice(0, 8)}
            </p>

            {/* Actions */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleDecision(task.id, 'approved')}
                className="border-2 border-sage bg-sage-pale text-sage px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:bg-sage/20 transition-colors"
              >
                ✓ approve
              </button>
              <button
                onClick={() => handleDecision(task.id, 'rejected')}
                className="border border-ink/20 text-ink-muted px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-terra/40 hover:text-terra transition-colors"
              >
                ✕ reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
