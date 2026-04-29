'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { GOALS, type GoalId } from '@/lib/goals'

export default function OnboardingPage() {
  const router = useRouter()
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const [selected, setSelected] = useState<GoalId[]>([])

  function toggle(id: GoalId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  function handleSubmit() {
    if (selected.length === 0) return
    completeOnboarding(selected)
    router.push('/')
  }

  return (
    <main className="flex min-h-screen flex-col px-7 pb-10 pt-14">
      {/* Header */}
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
          welcome to
        </p>
        <h1 className="mt-1 font-serif text-4xl font-black italic leading-none text-ink">
          Dopa
        </h1>
        <p className="mt-5 font-serif text-xl font-semibold italic leading-snug text-ink">
          When distraction hits, what do you want to build?
        </p>
        <p className="mt-2 font-serif text-sm italic text-ink-light leading-relaxed">
          Pick as many as feel true right now. We&apos;ll load your task list accordingly — you can always change it in settings.
        </p>
      </header>

      {/* Goal grid */}
      <div className="grid grid-cols-2 gap-3">
        {GOALS.map((goal) => {
          const isSelected = selected.includes(goal.id)
          return (
            <button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              className={`relative flex flex-col items-start border-2 p-4 text-left transition-all duration-150 active:scale-[0.97] ${
                isSelected
                  ? 'border-terra bg-terra text-parchment'
                  : 'border-ink/15 bg-parchment text-ink hover:border-terra/50'
              }`}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <span className="absolute right-3 top-3 font-mono text-[10px] text-terra-light">
                  ✓
                </span>
              )}
              <span className="mb-2 text-2xl leading-none">{goal.emoji}</span>
              <span
                className={`font-serif text-sm font-bold leading-tight ${
                  isSelected ? 'text-parchment' : 'text-ink'
                }`}
              >
                {goal.label}
              </span>
              <span
                className={`mt-1 font-mono text-[9px] uppercase tracking-wider leading-tight ${
                  isSelected ? 'text-terra-light' : 'text-ink-muted'
                }`}
              >
                {goal.description}
              </span>
            </button>
          )
        })}
      </div>

      {/* Count feedback */}
      <div className="mt-5 min-h-[20px]">
        {selected.length > 0 && (
          <p className="font-mono text-[10px] text-ink-muted">
            {selected.length} goal{selected.length !== 1 ? 's' : ''} selected
            {' · '}
            ~{selected.length * 15} tasks loaded across all three categories
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6 border-t border-ink/10 pt-5">
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="w-full border-2 border-terra bg-terra px-6 py-4 font-serif text-base font-black italic text-parchment transition-all duration-150 hover:bg-terra-dark disabled:cursor-not-allowed disabled:border-ink/20 disabled:bg-ink/10 disabled:text-ink-muted active:scale-[0.98]"
        >
          {selected.length === 0
            ? 'pick at least one →'
            : `build my task list →`}
        </button>
      </div>
    </main>
  )
}
