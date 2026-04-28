import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number // 0–100
  color?: 'terra' | 'sage' | 'ink'
}

export function Progress({ value = 0, color = 'terra', className, ...props }: ProgressProps) {
  const trackColor = {
    terra: 'bg-terra-pale',
    sage: 'bg-sage-pale',
    ink: 'bg-parchment-dark',
  }[color]

  const fillColor = {
    terra: 'bg-terra',
    sage: 'bg-sage',
    ink: 'bg-ink',
  }[color]

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full', trackColor, className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-1000 ease-linear', fillColor)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
