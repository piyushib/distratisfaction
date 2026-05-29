'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { useStore } from '@/lib/store'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string }>
}

export default function LoginPage() {
  const router = useRouter()
  const hasOnboarded = useStore((s) => s.hasOnboarded)
  const setHasSeenWelcome = useStore((s) => s.setHasSeenWelcome)
  const setStayLoggedIn = useStore((s) => s.setStayLoggedIn)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e as BeforeInstallPromptEvent) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (isIOS) { setShowIOSHint((v) => !v); return }
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  async function handleLogin() {
    if (!email || !password) return
    setStatus('loading')
    const { error } = await signIn(email.trim(), password)
    if (error) {
      setErrorMsg(error)
      setStatus('error')
    } else {
      setStayLoggedIn(remember)
      setHasSeenWelcome(true)
      router.push(hasOnboarded ? '/feed' : '/onboarding')
    }
  }

  function handleGuest() {
    setStayLoggedIn(false)
    setHasSeenWelcome(true)
    router.push(hasOnboarded ? '/feed' : '/onboarding')
  }

  const showInstall = !isInstalled && (installPrompt || isIOS)

  return (
    <main className="flex min-h-screen flex-col px-7 pt-14 pb-10">
      {/* Brand */}
      <div className="mb-8">
        <h1 className="font-serif text-5xl font-black italic leading-none text-ink">Dopa</h1>
        <p className="mt-3 font-serif text-sm italic text-ink-light leading-relaxed">
          Turn the urge to scroll into 2 minutes of real progress.
        </p>

        {/* Install button */}
        {showInstall && (
          <div className="mt-5">
            <button
              onClick={handleInstall}
              className="flex items-center gap-3 border border-terra/40 bg-terra/10 px-4 py-3 w-full hover:bg-terra/20 transition-colors"
            >
              <span className="text-lg">📲</span>
              <div className="text-left">
                <p className="font-mono text-[10px] uppercase tracking-widest text-terra">
                  {isIOS ? 'Add to Home Screen' : 'Install App'}
                </p>
                <p className="font-serif text-xs italic text-ink-muted mt-0.5">
                  {isIOS ? 'Tap for instructions' : 'Runs like a native app'}
                </p>
              </div>
              <span className="ml-auto font-mono text-[10px] text-terra">↓</span>
            </button>
            {isIOS && showIOSHint && (
              <div className="border border-terra/30 bg-terra/5 px-4 py-4 mt-px">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-3">how to install on iPhone</p>
                <ol className="space-y-2">
                  {[
                    { icon: '⬆️', text: 'Tap the Share button at the bottom of Safari' },
                    { icon: '📋', text: 'Tap "Add to Home Screen"' },
                    { icon: '✅', text: 'Tap "Add"' },
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-base leading-none mt-0.5">{s.icon}</span>
                      <p className="font-serif text-sm text-ink-light leading-snug">{s.text}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 font-serif text-xs italic text-ink-muted">Must use Safari on iOS.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-8 h-px bg-terra/50 mb-8" />

      {/* Login form */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1.5">email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full border border-ink/20 bg-parchment-light p-3 font-serif text-sm text-ink placeholder:text-ink-muted/40 focus:border-terra focus:outline-none"
          />
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1.5">password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-ink/20 bg-parchment-light p-3 font-serif text-sm text-ink placeholder:text-ink-muted/40 focus:border-terra focus:outline-none"
          />
        </div>

        {/* Stay logged in */}
        <button
          onClick={() => setRemember((v) => !v)}
          className="flex items-center gap-3 self-start"
        >
          <span className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${remember ? 'border-terra bg-terra' : 'border-ink/30'}`}>
            {remember && <span className="text-parchment text-[10px] leading-none">✓</span>}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            stay logged in
          </span>
        </button>

        {status === 'error' && (
          <p className="font-mono text-[10px] text-terra">{errorMsg}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={!email || !password || status === 'loading'}
          className="w-full border-2 border-terra bg-terra py-4 font-mono text-[11px] uppercase tracking-widest text-parchment hover:bg-terra-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? 'signing in…' : 'sign in →'}
        </button>

        <button
          onClick={() => router.push('/auth/signup')}
          className="w-full border-2 border-ink/20 py-4 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-terra/50 transition-colors"
        >
          create account
        </button>

        <button
          onClick={handleGuest}
          className="w-full py-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink transition-colors"
        >
          continue as guest
        </button>
      </div>
    </main>
  )
}
