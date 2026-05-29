'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export default function RootPage() {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const authReady = useStore((s) => s.authReady)
  const stayLoggedIn = useStore((s) => s.stayLoggedIn)
  const hasOnboarded = useStore((s) => s.hasOnboarded)

  useEffect(() => {
    if (!authReady) return

    if (user && stayLoggedIn) {
      // Returning logged-in user who chose "stay logged in" → straight to feed
      router.replace(hasOnboarded ? '/feed' : '/onboarding')
    } else {
      // Everyone else sees the login page
      router.replace('/auth/login')
    }
  }, [authReady, user, stayLoggedIn, hasOnboarded])

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment">
      <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">loading…</span>
    </div>
  )
}
