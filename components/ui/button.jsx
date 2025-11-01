import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50 disabled:pointer-events-none border shadow-notes hover:translate-y-[1px] bg-white dark:bg-[var(--bg)]',
  {
    variants: {
      variant: {
        default: '',
        primary: 'bg-[var(--accent)] text-black border-[var(--border)] hover:brightness-95',
        ghost: 'bg-transparent border-transparent shadow-none hover:bg-gray-50 dark:hover:bg-[#0f141b]'
      },
      size: {
        default: 'h-9 px-4 py-1.5',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const Button = React.forwardRef(function Button({ className, variant, size, asChild, ...props }, ref){
  const Comp = 'button'
  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
})

export { Button, buttonVariants }
