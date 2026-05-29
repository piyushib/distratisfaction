'use client'

import { useRouter } from 'next/navigation'
import { useStore, CATEGORY_META } from '@/lib/store'
import type { Category } from '@/lib/store'

export default function TaskTypesPage() {
  const router = useRouter()
  const enabledCategories = useStore((s) => s.enabledCategories)
  const toggleCategory = useStore((s) => s.toggleCategory)

  const categories = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]

  return (
    <main className="flex min-h-screen flex-col pb-24">
      <header className="px-6 pt-12 pb-6 border-b border-ink/10">
        <button onClick={() => router.back()} className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink mb-6">
          ← back
        </button>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">feed</p>
        <h1 className="mt-1 font-sans text-3xl font-black text-ink">Task Types</h1>
        <p className="mt-1 font-sans text-xs text-ink-muted leading-relaxed">
          Choose which types of tasks appear in your scroll feed.
        </p>
      </header>

      <div className="flex flex-col gap-px bg-ink/5 border-b border-ink/10 mt-4">
        {categories.map(([cat, meta]) => {
          const on = enabledCategories.includes(cat)
          const isLast = enabledCategories.length === 1 && on

          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              disabled={isLast}
              className={`flex items-center gap-4 px-6 py-5 text-left transition-colors ${
                on ? 'bg-parchment' : 'bg-parchment-light opacity-60'
              } ${!isLast ? 'hover:bg-parchment-light active:scale-[0.99]' : 'cursor-not-allowed'}`}
            >
              <span className="text-2xl leading-none w-8 text-center">{meta.emoji}</span>
              <div className="flex-1">
                <p className="font-sans text-sm font-semibold text-ink">{meta.label}</p>
                <p className="font-mono text-[10px] text-ink-muted mt-0.5">{meta.description}</p>
              </div>
              {/* Toggle pill */}
              <div className={`w-11 h-6 border-2 relative transition-colors ${on ? 'border-terra bg-terra' : 'border-ink/20 bg-parchment-dark'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-parchment transition-all ${on ? 'left-[calc(100%-1.1rem)]' : 'left-0.5'}`} />
              </div>
            </button>
          )
        })}
      </div>

      <p className="px-6 pt-4 font-sans text-xs italic text-ink-muted">
        At least one type must stay on. Changes take effect immediately in your feed.
      </p>
    </main>
  )
}
