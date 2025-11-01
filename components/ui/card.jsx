import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }){
  return (
    <div className={cn('rounded-lg border bg-white dark:bg-[var(--bg)] shadow-notes', className)} {...props} />
  )
}

function CardHeader({ className, ...props }){
  return <div className={cn('p-4 sm:p-6 border-b', className)} {...props} />
}

function CardTitle({ className, ...props }){
  return <h3 className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
}

function CardDescription({ className, ...props }){
  return <p className={cn('text-sm text-[var(--muted)]', className)} {...props} />
}

function CardContent({ className, ...props }){
  return <div className={cn('p-4 sm:p-6', className)} {...props} />
}

function CardFooter({ className, ...props }){
  return <div className={cn('p-4 sm:p-6 border-t', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
