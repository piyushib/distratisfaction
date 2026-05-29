'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/feed',     label: 'Home',     icon: '◉' },
  { href: '/log',      label: 'Insights', icon: '▤' },
  { href: '/rewards',  label: 'Rewards',  icon: '✦' },
  { href: '/settings', label: 'Tasks',    icon: '⊞' },
]

export function Nav() {
  const pathname = usePathname()

  // Hide nav on flow screens
  const hidden = ['/picker', '/task', '/done', '/welcome', '/auth/login', '/auth/signup', '/feed'].includes(pathname)
  if (hidden) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center border-t border-ink/10 bg-parchment/95 backdrop-blur-sm">
      <div className="flex w-full max-w-[440px] items-stretch">
        {links.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors',
                active ? 'text-terra' : 'text-ink-muted hover:text-ink-light'
              )}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
