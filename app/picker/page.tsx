'use client'

import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import type { Category } from '@/lib/store'
import { CATEGORY_APP_LINKS } from '@/lib/goals'
import { cn } from '@/lib/utils'

const categories: {
  id: Category
  color: string
  bg: string
  border: string
  hoverBg: string
}[] = [
  {
    id: 'learn',
    color: 'text-ink',
    bg: 'bg-parchment-dark',
    border: 'border-ink/20',
    hoverBg: 'hover:bg-parchment-deeper',
  },
  {
    id: 'absorb',
    color: 'text-slate-dark',
    bg: 'bg-slate-pale',
    border: 'border-slate/30',
    hoverBg: 'hover:bg-slate-light/30',
  },
  {
    id: 'hustle',
    color: 'text-terra-dark',
    bg: 'bg-terra-pale',
    border: 'border-terra/30',
    hoverBg: 'hover:bg-terra-light/30',
  },
  {
    id: 'reset',
    color: 'text-sage',
    bg: 'bg-sage-pale',
    border: 'border-sage/30',
    hoverBg: 'hover:bg-sage-light/30',
  },
]

export default function PickerPage() {
  const router = useRouter()
  const setPendingCategory = useStore((s) => s.setPendingCategory)

  function handlePick(cat: Category) {
    setPendingCategory(cat)
    router.push('/task')
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="px-7 pt-12">
        <button
          onClick={() => router.back()}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
        >
          ← back
        </button>
        <h2 className="mt-4 font-serif text-3xl font-black italic leading-tight text-ink">
          What kind of<br />minute do you need?
        </h2>
        <p className="mt-2 font-serif text-sm italic text-ink-light">
          Pick one. The app does the rest.
        </p>
      </header>

      {/* Category cards */}
      <div className="flex flex-1 flex-col gap-px px-7 py-8 border-y border-ink/10 mt-8 bg-ink/10">
        {categories.map(({ id, color, bg, border, hoverBg }) => {
          const meta = CATEGORY_META[id]
          const appLinks = CATEGORY_APP_LINKS[id]
          return (
            <button
              key={id}
              onClick={() => handlePick(id)}
              className={cn(
                'group flex items-center gap-5 border px-6 py-6 text-left transition-all duration-150 active:scale-[0.98]',
                bg,
                border,
                hoverBg
              )}
            >
              <span className="text-4xl leading-none" role="img" aria-label={meta.label}>
                {meta.emoji}
              </span>
              <div className="flex-1">
                <p className={cn('font-serif text-2xl font-black', color)}>{meta.label}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  {meta.description}
                </p>
                {/* App link hint */}
                {appLinks && (
                  <p className="mt-1.5 font-mono text-[9px] text-ink-muted/70">
                    opens → {appLinks.map((a) => a.name).join(' · ')}
                  </p>
                )}
              </div>
              <span className={cn('font-mono text-sm transition-transform group-hover:translate-x-1', color)}>
                →
              </span>
            </button>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="px-7 py-6">
        <p className="font-serif text-xs italic text-ink-muted leading-relaxed">
          Each task fits in 2 minutes. You can skip anytime — no judgment.
        </p>
      </div>
    </main>
  )
}
