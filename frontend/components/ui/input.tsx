import React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full h-10 px-3 rounded-md border border-input bg-muted text-sm text-foreground',
        'placeholder:text-muted-foreground',
        'transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
