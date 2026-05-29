'use client'

import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { signOut } from '@/lib/auth'

export default function SettingsPage() {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const setUser = useStore((s) => s.setUser)
  const setStayLoggedIn = useStore((s) => s.setStayLoggedIn)

  const menuItems = [
    {
      icon: '👤',
      label: 'Edit Profile',
      description: user ? `Signed in as @${user.username}` : 'Sign in or create account',
      href: '/settings/profile',
    },
    {
      icon: '📚',
      label: 'Edit Task Library',
      description: 'Add, edit, or remove tasks from your pool',
      href: '/settings/library',
    },
    {
      icon: '⊞',
      label: 'Edit Task Types',
      description: 'Choose which categories appear in your feed',
      href: '/settings/types',
    },
  ]

  return (
    <main className="flex min-h-screen flex-col pb-24">
      <header className="px-6 pt-12 pb-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-muted">app</p>
        <h1 className="mt-1 font-sans text-3xl font-black text-ink">Settings</h1>
      </header>

      <div className="flex flex-col gap-px bg-ink/5 border-y border-ink/10">
        {menuItems.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="flex items-center gap-4 bg-parchment px-6 py-5 text-left hover:bg-parchment-light transition-colors active:scale-[0.99]"
          >
            <span className="text-2xl leading-none w-8 text-center">{item.icon}</span>
            <div className="flex-1">
              <p className="font-sans text-sm font-semibold text-ink">{item.label}</p>
              <p className="font-mono text-[10px] text-ink-muted mt-0.5">{item.description}</p>
            </div>
            <span className="font-mono text-ink-muted text-sm">→</span>
          </button>
        ))}
      </div>

      {/* Sign out / sign in */}
      <div className="px-6 mt-8">
        {user ? (
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
        ) : (
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full border-2 border-terra bg-terra py-3 font-mono text-[10px] uppercase tracking-widest text-parchment hover:bg-terra-dark transition-colors"
          >
            sign in / create account
          </button>
        )}
      </div>
    </main>
  )
}
