'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import type { Category, Task } from '@/lib/store'
import { SubmitTask } from '@/components/submit-task'

const CATEGORIES: Category[] = ['learn', 'absorb', 'hustle', 'reset']

export default function LibraryPage() {
  const router = useRouter()
  const { tasks, addTask, updateTask, deleteTask } = useStore()
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('learn')
  const [newTaskText, setNewTaskText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showSubmit, setShowSubmit] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">loading…</span>
    </div>
  )

  const activeTasks = tasks.filter((t) => t.category === activeCategory)
  const meta = CATEGORY_META[activeCategory]

  function handleAdd() {
    const text = newTaskText.trim()
    if (!text) return
    addTask(activeCategory, text)
    setNewTaskText('')
  }

  return (
    <main className="flex min-h-screen flex-col pb-24">
      <header className="px-6 pt-12 pb-5 border-b border-ink/10">
        <button onClick={() => router.back()} className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink mb-6">
          ← back
        </button>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">tasks</p>
        <h1 className="mt-1 font-sans text-3xl font-black text-ink">Task Library</h1>
        <p className="mt-1 font-sans text-xs text-ink-muted leading-relaxed">
          These are the tasks Dopa draws from. Keep them under 5 minutes.
        </p>
      </header>

      {/* Category tabs */}
      <div className="flex border-b border-ink/10">
        {CATEGORIES.map((cat) => {
          const m = CATEGORY_META[cat]
          const count = tasks.filter((t) => t.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors border-b-2 ${
                activeCategory === cat ? 'border-terra text-ink' : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <span className="text-lg leading-none">{m.emoji}</span>
              <span className="font-sans text-[10px] font-semibold">{m.label}</span>
              <span className="font-mono text-[9px] text-ink-muted">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Task list */}
      <div className="flex-1 px-6 pt-5">
        {activeTasks.length === 0 ? (
          <p className="font-sans text-sm italic text-ink-muted py-4">No tasks yet. Add one below.</p>
        ) : (
          <div className="flex flex-col gap-px border border-ink/10 bg-ink/5">
            {activeTasks.map((task) => (
              editingId === task.id ? (
                <div key={task.id} className="bg-parchment-light px-4 py-3 flex flex-col gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { updateTask(task.id, editText); setEditingId(null) }
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="w-full border border-ink/20 bg-parchment p-2 font-sans text-sm text-ink focus:border-terra focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { updateTask(task.id, editText); setEditingId(null) }} className="border border-terra px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-terra">save</button>
                    <button onClick={() => setEditingId(null)} className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">cancel</button>
                  </div>
                </div>
              ) : (
                <div key={task.id} className="group flex items-start gap-3 bg-parchment px-4 py-4">
                  <p className="flex-1 font-sans text-sm text-ink leading-snug">{task.text}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(task.id); setEditText(task.text) }} className="font-mono text-[9px] uppercase tracking-widest text-ink-muted hover:text-ink px-2 py-1">edit</button>
                    <button onClick={() => deleteTask(task.id)} className="font-mono text-[9px] uppercase tracking-widest text-ink-muted hover:text-terra px-2 py-1">del</button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Add task */}
        <div className="mt-5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-2">add a task</p>
          <div className="flex gap-2">
            <input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder={`New ${meta.label} task…`}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 border border-ink/20 bg-parchment-light p-3 font-sans text-sm text-ink placeholder:text-ink-muted/40 focus:border-terra focus:outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={!newTaskText.trim()}
              className="border-2 border-terra bg-terra px-4 font-mono text-[10px] uppercase tracking-widest text-parchment disabled:opacity-40 hover:bg-terra-dark transition-colors"
            >
              add
            </button>
          </div>
        </div>
      </div>

      {/* Share with community */}
      <div className="px-6 pt-6 mt-4 border-t border-ink/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-sans text-sm font-semibold text-ink">Share a task</p>
            <p className="font-mono text-[10px] text-ink-muted mt-0.5">Submit to the community pool</p>
          </div>
          {!showSubmit && (
            <button onClick={() => setShowSubmit(true)} className="border-2 border-terra bg-terra px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-parchment hover:bg-terra-dark transition-colors">
              + share
            </button>
          )}
        </div>
        {showSubmit && <SubmitTask onClose={() => setShowSubmit(false)} />}
      </div>
    </main>
  )
}
