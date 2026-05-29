'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

type Reward = {
  id: string
  brand: string
  description: string
  cost: number  // seconds
  category: string
  emoji: string
  tag: string
}

const REWARDS: Reward[] = [
  {
    id: 'headspace-10',
    brand: 'Headspace',
    description: '10% off annual subscription',
    cost: 600,   // 10 min
    category: 'meditation',
    emoji: '🧘',
    tag: 'meditation',
  },
  {
    id: 'calm-15',
    brand: 'Calm',
    description: '15% off annual plan',
    cost: 900,   // 15 min
    category: 'sleep',
    emoji: '🌙',
    tag: 'sleep & focus',
  },
  {
    id: 'ritual-10',
    brand: 'Ritual',
    description: '10% off your first vitamin order',
    cost: 600,   // 10 min
    category: 'nutrition',
    emoji: '💊',
    tag: 'vitamins',
  },
  {
    id: 'athletic-greens',
    brand: 'AG1',
    description: 'Free 5-day travel pack with any order',
    cost: 1200,  // 20 min
    category: 'nutrition',
    emoji: '🥤',
    tag: 'nutrition',
  },
  {
    id: 'whoop-month',
    brand: 'WHOOP',
    description: '1 free month added to membership',
    cost: 1800,  // 30 min
    category: 'fitness',
    emoji: '⌚',
    tag: 'fitness tracking',
  },
  {
    id: 'nuzest-20',
    brand: 'Nuzest',
    description: '20% off clean protein',
    cost: 900,
    category: 'nutrition',
    emoji: '🌿',
    tag: 'clean protein',
  },
  {
    id: 'oura-ring',
    brand: 'Oura Ring',
    description: '$30 off any ring',
    cost: 3000,  // 50 min
    category: 'fitness',
    emoji: '💍',
    tag: 'sleep & recovery',
  },
  {
    id: 'superhuman',
    brand: 'Superhuman',
    description: '1 month free trial',
    cost: 1200,
    category: 'productivity',
    emoji: '⚡',
    tag: 'productivity',
  },
]

function formatMinutes(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.round(seconds / 60)
  return `${m} min`
}

export default function RewardsPage() {
  const router = useRouter()
  const productivitySeconds = useStore((s) => s.productivitySeconds)
  const redeemedSeconds = useStore((s) => s.redeemedSeconds)
  const redeemSeconds = useStore((s) => s.redeemSeconds)
  const [redeemedId, setRedeemedId] = useState<string | null>(null)

  const totalEarned = productivitySeconds + redeemedSeconds
  const available = productivitySeconds
  const progressToNext = REWARDS.find((r) => r.cost > available)
  const percentFull = progressToNext
    ? Math.min(100, (available / progressToNext.cost) * 100)
    : 100

  function handleRedeem(reward: Reward) {
    if (available < reward.cost) return
    redeemSeconds(reward.cost)
    setRedeemedId(reward.id)
    setTimeout(() => setRedeemedId(null), 3000)
  }

  return (
    <main className="flex min-h-screen flex-col pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">your balance</p>
        <h1 className="mt-1 font-sans text-3xl font-black text-ink">Rewards</h1>

        {/* Balance card */}
        <div className="mt-5 border border-terra/30 bg-terra/10 px-5 py-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-terra">productivity bank</p>
              <p className="mt-1 font-sans text-4xl font-black text-ink tabular-nums">
                {formatMinutes(available)}
              </p>
              <p className="font-mono text-[9px] text-ink-muted mt-0.5">
                {formatMinutes(totalEarned)} earned total
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">redeemed</p>
              <p className="mt-1 font-sans text-xl font-bold text-ink-muted">{formatMinutes(redeemedSeconds)}</p>
            </div>
          </div>

          {/* Progress to next reward */}
          {progressToNext && (
            <div className="mt-4">
              <div className="flex justify-between mb-1.5">
                <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest">
                  next: {progressToNext.brand}
                </p>
                <p className="font-mono text-[9px] text-ink-muted">
                  {formatMinutes(available)} / {formatMinutes(progressToNext.cost)}
                </p>
              </div>
              <div className="h-1.5 bg-parchment-light w-full">
                <div
                  className="h-full bg-terra transition-all duration-500"
                  style={{ width: `${percentFull}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 font-sans text-xs text-ink-muted leading-relaxed">
          Complete tasks to earn time in your productivity bank. Redeem for discounts on wellness products.
        </p>
      </header>

      {/* Rewards list */}
      <div className="px-6 space-y-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-4">available rewards</p>

        {REWARDS.map((reward) => {
          const canRedeem = available >= reward.cost
          const justRedeemed = redeemedId === reward.id

          return (
            <div
              key={reward.id}
              className={`border p-4 transition-colors ${
                canRedeem ? 'border-terra/40 bg-terra/5' : 'border-ink/10 bg-parchment-light'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5">{reward.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-sans text-sm font-bold text-ink">{reward.brand}</p>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-ink-muted border border-ink/15 px-1.5 py-0.5">
                      {reward.tag}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-ink-muted mt-0.5">{reward.description}</p>
                  <p className="font-mono text-[10px] text-terra mt-1.5">
                    {formatMinutes(reward.cost)} required
                    {!canRedeem && available > 0 && (
                      <span className="text-ink-muted ml-2">
                        ({formatMinutes(reward.cost - available)} more needed)
                      </span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canRedeem}
                  className={`flex-shrink-0 border-2 px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
                    justRedeemed
                      ? 'border-sage text-sage'
                      : canRedeem
                      ? 'border-terra bg-terra text-parchment hover:bg-terra-dark'
                      : 'border-ink/15 text-ink-muted cursor-not-allowed opacity-40'
                  }`}
                >
                  {justRedeemed ? '✓ done' : 'redeem'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-6 pt-6 pb-2">
        <p className="font-sans text-xs italic text-ink-muted leading-relaxed">
          Redemption codes are delivered to your registered email. Partner offers may change over time.
        </p>
      </div>
    </main>
  )
}
