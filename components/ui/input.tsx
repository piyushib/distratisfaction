import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    className={cn(
      'w-full border border-ink/20 bg-parchment-light px-4 py-3 font-mono text-sm text-ink placeholder:text-ink-muted focus:border-terra focus:outline-none focus:ring-1 focus:ring-terra transition-colors',
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }
