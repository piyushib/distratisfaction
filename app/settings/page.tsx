'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import type { Category, Task } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SubmitTask } from '@/components/submit-task'

const CATEGORIES: Category[] = ['learn', 'absorb', 'hustle', 'reset']

export default function SettingsPage() {
  const router = useRouter()
  const { tasks, addTask, updateTask, deleteTask, resetOnboarding, selectedGoals } = useStore()
  const [mounted, setMounted] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('learn')
  const [newTaskText, setNewTaskText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">loading…</span>
      </div>
    )
  }

  const activeTasks = tasks.filter((t) => t.category === activeCategory)
  const meta = CATEGORY_META[activeCategory]

  function handleAdd() {
    const text = newTaskText.trim()
    if (!text) return
    addTask(activeCategory, text)
    setNewTaskText('')
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setEditText(task.text)
  }

  function commitEdit(id: string) {
    const text = editText.trim()
    if (!text) return
    updateTask(id, text)
    setEditingId(null)
    setEditText('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  return (
    <main className="flex min-h-screen flex-col pb-24">
      {/* Header */}
      <header className="px-7 pt-12 pb-6 border-b border-ink/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
          manage
        </p>
        <h2 className="mt-1 font-serif text-3xl font-black italic text-ink">
          Task Pools
        </h2>
        <p className="mt-2 font-serif text-xs italic text-ink-light leading-relaxed">
          These are the tasks Dopa draws from. Keep them tight — 2 minutes max.
        </p>
        {/* Goals summary + re-onboard link */}
        <div className="mt-4 flex items-center justify-between border border-ink/10 bg-parchment px-3 py-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">your goals</p>
            <p className="mt-0.5 font-serif text-xs text-ink">
              {selectedGoals.length > 0
                ? selectedGoals.join(', ')
                : 'none set'}
            </p>
          </div>
          <button
            onClick={() => { resetOnboarding(); router.push('/onboarding') }}
            className="font-mono text-[10px] uppercase tracking-widest text-terra underline underline-offset-2 hover:text-terra-dark transition-colors"
          >
            update
          </button>
        </div>
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
              className={cn(
                'flex-1 flex flex-col items-center py-4 gap-0.5 transition-colors border-b-2',
                activeCategory === cat
                  ? 'border-terra text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              <span className="text-xl leading-none">{m.emoji}</span>
              <span className="font-serif text-xs font-semibold">{m.label}</span>
              <span className="font-mono text-[9px] text-ink-muted">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Task list */}
      <div className="flex-1 px-7 pt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">
            {meta.emoji} {meta.label} tasks — {activeTasks.length}
          </p>
        </div>

        {activeTasks.length === 0 ? (
          <p className="font-serif text-sm italic text-ink-muted py-4">
            No tasks yet. Add one below.
          </p>
        ) : (
          <div className="space-y-px border border-ink/10 bg-ink/10">
            {activeTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                editing={editingId === task.id}
                editText={editText}
                onEdit={() => startEdit(task)}
                onEditChange={setEditText}
                onEditCommit={() => commitEdit(task.id)}
                onEditCancel={cancelEdit}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        )}

        {/* Add new task */}
        <div className="mt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-2">
            add a task
          </p>
          <div className="flex gap-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Describe something doable in 60s…"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1"
            />
            <Button
              variant="terra"
              size="default"
              onClick={handleAdd}
              disabled={!newTaskText.trim()}
            >
              add
            </Button>
          </div>
          <p className="mt-1.5 font-serif text-[11px] italic text-ink-muted">
            Tip: start with a verb. "Write", "Read", "Name", "Look up"…
          </p>
        </div>
      </div>

      {/* Share a task with the community */}
      <div className="px-7 pt-8 border-t border-ink/10 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">community</p>
            <p className="font-serif text-sm font-bold text-ink mt-0.5">Share a task</p>
            <p className="font-serif text-xs italic text-ink-muted leading-snug mt-0.5">
              Submit a task privately or to the community pool.
            </p>
          </div>
          {!showSubmit && (
            <button
              onClick={() => setShowSubmit(true)}
              className="flex-shrink-0 border-2 border-terra bg-terra px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-parchment hover:bg-terra-dark transition-colors"
            >
              + share
            </button>
          )}
        </div>
        {showSubmit && <SubmitTask onClose={() => setShowSubmit(false)} />}
      </div>

      {/* Reset to defaults */}
      <div className="px-7 pt-8 pb-4 border-t border-ink/10 mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-1">
          danger zone
        </p>
        <ResetSection />
      </div>
    </main>
  )
}

function TaskRow({
  task,
  editing,
  editText,
  onEdit,
  onEditChange,
  onEditCommit,
  onEditCancel,
  onDelete,
}: {
  task: Task
  editing: boolean
  editText: string
  onEdit: () => void
  onEditChange: (v: string) => void
  onEditCommit: () => void
  onEditCancel: () => void
  onDelete: () => void
}) {
  if (editing) {
    return (
      <div className="bg-parchment-light px-4 py-3 space-y-2">
        <Input
          value={editText}
          onChange={(e) => onEditChange(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEditCommit()
            if (e.key === 'Escape') onEditCancel()
          }}
        />
        <div className="flex gap-2">
          <Button variant="sage" size="sm" onClick={onEditCommit}>
            save
          </Button>
          <Button variant="ghost" size="sm" onClick={onEditCancel}>
            cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-3 bg-parchment px-4 py-4">
      <p className="flex-1 font-serif text-sm text-ink leading-snug">{task.text}</p>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={onEdit}
          className="font-mono text-[9px] uppercase tracking-widest text-ink-muted hover:text-ink px-2 py-1 transition-colors"
        >
          edit
        </button>
        <button
          onClick={onDelete}
          className="font-mono text-[9px] uppercase tracking-widest text-ink-muted hover:text-terra px-2 py-1 transition-colors"
        >
          del
        </button>
      </div>
    </div>
  )
}

function ResetSection() {
  const { tasks, addTask } = useStore()
  const [confirmed, setConfirmed] = useState(false)

  // Lazy import of seed to avoid circular deps at module level
  async function handleReset() {
    if (!confirmed) {
      setConfirmed(true)
      return
    }
    const { SEED_TASKS } = await import('@/lib/seed')
    // Add any seed tasks that don't already exist by id
    for (const t of SEED_TASKS) {
      if (!tasks.find((existing) => existing.id === t.id)) {
        addTask(t.category, t.text)
      }
    }
    setConfirmed(false)
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className={confirmed ? 'border-terra text-terra' : ''}
      >
        {confirmed ? 'confirm restore defaults?' : 'restore default tasks'}
      </Button>
      {confirmed && (
        <button
          onClick={() => setConfirmed(false)}
          className="font-mono text-[9px] uppercase tracking-widest text-ink-muted hover:text-ink"
        >
          cancel
        </button>
      )}
    </div>
  )
}
