'use client'

import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { signOut } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const setUser = useStore((s) => s.setUser)
  const setStayLoggedIn = useStore((s) => s.setStayLoggedIn)
  const sessions = useStore((s) => s.sessions)
  const productivitySeconds = useStore((s) => s.productivitySeconds)
  const redeemedSeconds = useStore((s) => s.redeemedSeconds)

  const completed = sessions.filter((s) => s.completed).length
  const totalMin = Math.round((productivitySeconds + redeemedSeconds) / 60)

  return (
    <main className="flex min-h-screen flex-col pb-24">
      <header className="px-6 pt-12 pb-6 border-b border-ink/10">
        <button onClick={() => router.back()} className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink mb-6">
          ← back
        </button>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">account</p>
        <h1 className="mt-1 font-sans text-3xl font-black text-ink">Profile</h1>
      </header>

      {user ? (
        <div className="px-6 pt-6 flex flex-col gap-6">
          {/* Account info */}
          <div className="border border-ink/10 bg-parchment-light p-5">
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-3">account</p>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest">username</p>
                <p className="font-sans text-base font-bold text-terra mt-0.5">@{user.username}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-ink-muted uppercase tracking-widest">email</p>
                <p className="font-sans text-sm text-ink mt-0.5">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-3">your stats</p>
            <div className="grid grid-cols-3 gap-px bg-ink/10 border border-ink/10">
              {[
                { value: sessions.length, label: 'sessions' },
                { value: completed, label: 'completed' },
                { value: `${totalMin}m`, label: 'earned' },
              ].map((s) => (
                <div key={s.label} className="bg-parchment flex flex-col items-center py-5">
                  <span className="font-sans text-2xl font-black text-ink">{s.value}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={async () => {
              await signOut()
              setUser(null)
              setStayLoggedIn(false)
              router.push('/auth/login')
            }}
            className="w-full border border-ink/20 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:border-terra/40 hover:text-terra transition-colors"
          >
            sign out
          </button>
        </div>
      ) : (
        <div className="px-6 pt-8 flex flex-col gap-4">
          <p className="font-sans text-sm italic text-ink-muted leading-relaxed">
            Sign in to sync your tasks and sessions across devices, and to share tasks with the community.
          </p>
          <button
            onClick={() => router.push('/auth/signup')}
            className="w-full border-2 border-terra bg-terra py-4 font-mono text-[11px] uppercase tracking-widest text-parchment hover:bg-terra-dark transition-colors"
          >
            create account →
          </button>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full border-2 border-ink/20 py-4 font-mono text-[11px] uppercase tracking-widest text-ink hover:border-terra/50 transition-colors"
          >
            sign in
          </button>
        </div>
      )}
    </main>
  )
}
