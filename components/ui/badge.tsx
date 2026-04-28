import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/store'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category?: Category
}

const categoryStyle: Record<Category, string> = {
  learn:  'bg-parchment-dark text-ink border-ink/20',
  absorb: 'bg-slate-pale text-slate-dark border-slate/20',
  hustle: 'bg-terra-pale text-terra-dark border-terra/20',
  reset:  'bg-sage-pale text-sage border-sage/20',
}

export function Badge({ category, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border px-2.5 py-0.5 font-mono text-xs uppercase tracking-widest',
        category ? categoryStyle[category] : 'bg-parchment-dark text-ink-light border-ink/10',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
