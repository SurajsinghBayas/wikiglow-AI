import * as React from 'react'
import { cn } from '@/lib/utils'

function Badge({ className, variant = 'default', ...props }){
  const base = 'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shadow-notes'
  const variants = {
    default: 'bg-white dark:bg-[var(--bg)]',
    accent: 'bg-[var(--accent)] text-black border-[var(--border)]',
    outline: 'bg-transparent'
  }
  return <span className={cn(base, variants[variant], className)} {...props} />
}

export { Badge }
