'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export default function WelcomePage() {
  const router = useRouter()
  const setHasSeenWelcome = useStore((s) => s.setHasSeenWelcome)
  const hasOnboarded = useStore((s) => s.hasOnboarded)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function continueAsGuest() {
    setHasSeenWelcome(true)
    router.push(hasOnboarded ? '/' : '/onboarding')
  }

  if (!mounted) return null

  return (
    <main className="flex min-h-screen flex-col px-7 pt-16 pb-12">
      {/* Brand */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-ink-muted">
          welcome to
        </p>
        <h1 className="mt-2 font-serif text-6xl font-black italic leading-none text-ink">
          Dopa
        </h1>
        <p className="mt-4 font-serif text-base italic text-ink-light leading-relaxed max-w-xs">
          Turn the urge to scroll into 2 minutes of real progress.
        </p>

        <div className="mt-3 w-12 h-px bg-terra" />

        <p className="mt-6 font-serif text-sm italic text-ink-muted leading-relaxed">
          Built for ADHD brains. No shame, no streaks to break — just tiny wins.
        </p>
      </div>

      {/* Auth options */}
      <div className="flex flex-col gap-3 pt-8">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted mb-1">
          get started
        </p>

        <button
          onClick={() => router.push('/auth/signup')}
          className="w-full border-2 border-terra bg-terra py-4 font-mono text-[11px] uppercase tracking-widest text-parchment hover:bg-terra-dark transition-colors"
        >
          create account →
        </button>

        <button
          onClick={() => router.push('/auth/login')}
          className="w-full border-2 border-ink/30 py-4 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-terra/60 transition-colors"
        >
          sign in
        </button>

        <button
          onClick={continueAsGuest}
          className="w-full py-4 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
        >
          continue as guest
        </button>

        <p className="mt-2 font-serif text-xs italic text-ink-muted text-center leading-relaxed">
          Account needed only to share tasks publicly.
          <br />
          Your data stays on your device otherwise.
        </p>
      </div>
    </main>
  )
}
