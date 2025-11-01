"use client"
import ConvertHero from '@/components/ConvertHero'

export default function ConvertPage(){
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-extrabold mb-2">Convert an article</h1>
        <p className="text-[var(--muted)] mb-4">Search or paste a URL to open a clean, distraction-free view.</p>
        <ConvertHero />
      </div>
    </main>
  )
}
