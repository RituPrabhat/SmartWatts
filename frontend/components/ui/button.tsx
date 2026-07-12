'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
type Size = 'sm' | 'md' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-accent disabled:opacity-50',
  outline:
    'border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50',
  ghost:
    'text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50',
  destructive:
    'bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  icon: 'h-9 w-9 rounded-lg',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium whitespace-nowrap',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button }
