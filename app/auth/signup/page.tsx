'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { useStore } from '@/lib/store'

export default function SignupPage() {
  const router = useRouter()
  const hasOnboarded = useStore((s) => s.hasOnboarded)
  const setHasSeenWelcome = useStore((s) => s.setHasSeenWelcome)
  const setStayLoggedIn = useStore((s) => s.setStayLoggedIn)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSignup() {
    if (!username.trim() || !email || !password) return
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters')
      setStatus('error')
      return
    }
    setStatus('loading')
    const { error } = await signUp(email.trim(), password, username.trim())
    if (error) {
      setErrorMsg(error)
      setStatus('error')
    } else {
      setStayLoggedIn(true)
      setHasSeenWelcome(true)
      router.push(hasOnboarded ? '/feed' : '/onboarding')
    }
  }

  const usernameClean = username.toLowerCase().replace(/[^a-z0-9_]/g, '')

  return (
    <main className="flex min-h-screen flex-col px-7 pt-16 pb-24">
      <button
        onClick={() => router.back()}
        className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink mb-8"
      >
        ← back
      </button>

      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">account</p>
      <h1 className="mt-1 font-serif text-3xl font-black italic text-ink">Create account</h1>
      <p className="mt-2 font-serif text-sm italic text-ink-light leading-relaxed">
        Sign up to share tasks with the community and sync across devices.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1.5">username</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="your_handle"
            maxLength={20}
            autoComplete="username"
            className="w-full border border-ink/20 bg-parchment-light p-3 font-mono text-sm text-ink placeholder:text-ink-muted/50 focus:border-terra focus:outline-none"
          />
          {username && (
            <p className="mt-1 font-mono text-[9px] text-ink-muted">@{usernameClean}</p>
          )}
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1.5">email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full border border-ink/20 bg-parchment-light p-3 font-serif text-sm text-ink placeholder:text-ink-muted/50 focus:border-terra focus:outline-none"
          />
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1.5">password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="min. 6 characters"
            autoComplete="new-password"
            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
            className="w-full border border-ink/20 bg-parchment-light p-3 font-serif text-sm text-ink placeholder:text-ink-muted/50 focus:border-terra focus:outline-none"
          />
        </div>

        {status === 'error' && (
          <p className="font-mono text-[10px] text-terra leading-relaxed">{errorMsg}</p>
        )}

        <button
          onClick={handleSignup}
          disabled={!username || !email || !password || status === 'loading'}
          className="mt-2 w-full border-2 border-terra bg-terra py-3 font-mono text-[10px] uppercase tracking-widest text-parchment hover:bg-terra-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? 'creating account…' : 'create account →'}
        </button>

        <p className="text-center font-serif text-xs italic text-ink-muted">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/auth/login')}
            className="text-terra underline underline-offset-2"
          >
            Sign in
          </button>
        </p>
      </div>
    </main>
  )
}
