import React from 'react'
import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const tones: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-accent text-accent-foreground',
  success: 'bg-[color-mix(in_srgb,var(--success)_18%,transparent)] text-[var(--success)]',
  warning: 'bg-[color-mix(in_srgb,var(--warning)_18%,transparent)] text-[var(--warning)]',
  danger: 'bg-[color-mix(in_srgb,var(--destructive)_18%,transparent)] text-[var(--destructive)]',
}

function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
