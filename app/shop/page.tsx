'use client'

const products = [
  {
    id: 'journal',
    emoji: '📓',
    name: 'Dopa Daily Journal',
    tagline: 'Your offline distraction log.',
    description: 'A 90-day guided journal built around the same 2-minute micro-task framework. Morning intention, evening reflection, weekly review.',
    price: '$24',
    badge: 'Physical',
    badgeColor: 'border-slate/40 bg-slate-pale text-slate-dark',
    available: false,
  },
  {
    id: 'cards',
    emoji: '🃏',
    name: 'Task Deck',
    tagline: '60 cards. Pull one when you spiral.',
    description: 'A pocket-sized card deck — 20 Learn, 20 Absorb, 20 Reset tasks. No phone required. Keep it on your desk.',
    price: '$18',
    badge: 'Physical',
    badgeColor: 'border-slate/40 bg-slate-pale text-slate-dark',
    available: false,
  },
  {
    id: 'poster',
    emoji: '🧠',
    name: 'Brain Map Poster',
    tagline: 'The neuroscience of distraction, illustrated.',
    description: 'A 18×24" risograph-style print explaining the dopamine loop — why we scroll, and how micro-tasks rewire the reward circuit.',
    price: '$32',
    badge: 'Physical',
    badgeColor: 'border-slate/40 bg-slate-pale text-slate-dark',
    available: false,
  },
  {
    id: 'stickers',
    emoji: '✦',
    name: 'Dopa Sticker Pack',
    tagline: 'Brain. Bolt. Leaf. On everything.',
    description: '5 die-cut vinyl stickers — the Dopa brain, the three category icons, and one affirmation sticker. Weatherproof.',
    price: '$8',
    badge: 'Physical',
    badgeColor: 'border-slate/40 bg-slate-pale text-slate-dark',
    available: false,
  },
  {
    id: 'pro',
    emoji: '⚡',
    name: 'Dopa Pro',
    tagline: 'Longer sessions, custom timers, streak recovery.',
    description: 'Unlock 5, 10, and 15-minute task modes, custom task categories, streak forgiveness days, and a shareable progress card.',
    price: '$4/mo',
    badge: 'Digital',
    badgeColor: 'border-terra/30 bg-terra-pale text-terra-dark',
    available: false,
  },
  {
    id: 'community',
    emoji: '🌱',
    name: 'Community Task Pools',
    tagline: 'Tasks written by people like you.',
    description: 'Access curated task pools from the Dopa community — writers, founders, students, and people in recovery. Rotating monthly.',
    price: '$2/mo',
    badge: 'Digital',
    badgeColor: 'border-sage/30 bg-sage-pale text-sage',
    available: false,
  },
]

export default function ShopPage() {
  return (
    <main className="flex min-h-screen flex-col pb-24">
      {/* Header */}
      <header className="px-7 pt-12 pb-6 border-b border-ink/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
          coming soon
        </p>
        <h2 className="mt-1 font-serif text-3xl font-black italic text-ink">
          Dopa Shop
        </h2>
        <p className="mt-2 font-serif text-sm italic text-ink-light leading-relaxed">
          Physical goods and digital upgrades — tools to take the practice offline.
        </p>
      </header>

      {/* Notify banner */}
      <div className="mx-7 mt-6 border border-terra/30 bg-terra-pale px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-terra-dark mb-2">
          want early access?
        </p>
        <p className="font-serif text-xs italic text-ink-light leading-relaxed">
          Everything here is in development. If you want to be notified when products launch, send a note to{' '}
          <span className="font-mono text-[10px] text-terra">shop@getdopa.app</span>
        </p>
      </div>

      {/* Product grid */}
      <div className="flex flex-col gap-px px-7 mt-6 bg-ink/5 border-y border-ink/10">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex gap-4 bg-parchment px-0 py-5 border-b border-ink/5 last:border-0"
          >
            {/* Emoji icon */}
            <div className="flex-shrink-0 w-12 h-12 border border-ink/10 flex items-center justify-center text-2xl bg-parchment-light">
              {p.emoji}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-serif text-base font-bold text-ink leading-tight">
                    {p.name}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mt-0.5">
                    {p.tagline}
                  </p>
                </div>
                <span className={`flex-shrink-0 font-serif text-sm font-black text-ink`}>
                  {p.price}
                </span>
              </div>

              <p className="mt-2 font-serif text-xs italic text-ink-light leading-relaxed">
                {p.description}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${p.badgeColor}`}>
                  {p.badge}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted/60">
                  not yet available
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="px-7 pt-6">
        <p className="font-serif text-xs italic text-ink-muted leading-relaxed">
          All physical goods will be made in small runs. No overstock, no waste.
        </p>
      </div>
    </main>
  )
}
