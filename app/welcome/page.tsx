'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string }>
}

export default function WelcomePage() {
  const router = useRouter()
  const setHasSeenWelcome = useStore((s) => s.setHasSeenWelcome)
  const hasOnboarded = useStore((s) => s.hasOnboarded)
  const [mounted, setMounted] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Detect iOS Safari (no beforeinstallprompt support)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(ios)

    // Android / Chrome / Edge install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setInstallPrompt(null)
    })
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (isIOS) {
      setShowIOSHint((v) => !v)
      return
    }
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setInstallPrompt(null)
    }
  }

  function continueAsGuest() {
    setHasSeenWelcome(true)
    router.push(hasOnboarded ? '/' : '/onboarding')
  }

  if (!mounted) return null

  const showInstallButton = !isInstalled && (installPrompt || isIOS)

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

        {/* Install as app */}
        {showInstallButton && !installed && (
          <div className="mt-8">
            <button
              onClick={handleInstall}
              className="flex items-center gap-3 border border-terra/40 bg-terra/10 px-4 py-3 w-full hover:bg-terra/20 transition-colors"
            >
              <span className="text-xl leading-none">📲</span>
              <div className="text-left">
                <p className="font-mono text-[10px] uppercase tracking-widest text-terra">
                  {isIOS ? 'Add to Home Screen' : 'Install App'}
                </p>
                <p className="font-serif text-xs italic text-ink-muted mt-0.5">
                  {isIOS ? 'Tap for instructions' : 'One tap — runs like a native app'}
                </p>
              </div>
              <span className="ml-auto font-mono text-[10px] text-terra">↓</span>
            </button>

            {/* iOS step-by-step hint */}
            {isIOS && showIOSHint && (
              <div className="border border-terra/30 bg-terra/5 px-4 py-4 mt-px">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-3">
                  how to install on iPhone
                </p>
                <ol className="space-y-2">
                  {[
                    { icon: '⬆️', text: 'Tap the Share button at the bottom of Safari' },
                    { icon: '📋', text: 'Scroll down and tap "Add to Home Screen"' },
                    { icon: '✅', text: 'Tap "Add" — Dopa appears on your home screen' },
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-base leading-none mt-0.5">{step.icon}</span>
                      <p className="font-serif text-sm text-ink-light leading-snug">{step.text}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 font-serif text-xs italic text-ink-muted">
                  Must be opened in Safari (not Chrome) on iOS.
                </p>
              </div>
            )}
          </div>
        )}

        {installed && (
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-terra">
            ✓ App installed
          </p>
        )}
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
