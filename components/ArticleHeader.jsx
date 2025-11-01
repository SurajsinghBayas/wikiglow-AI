import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from '@/lib/toast'

export default function ArticleHeader({meta, slug}){
  const title = meta?.title || 'Article'
  const excerpt = meta?.excerpt || ''
  const readMins = meta?.readMins || 1
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const [isSaved, setIsSaved] = useState(false)

  useEffect(()=>{
    try{
      const list = JSON.parse(localStorage.getItem('readingList')||'[]')
      setIsSaved(!!list.find(x=>x.slug===slug))
    }catch{ setIsSaved(false) }
  },[slug])

  const copy = async ()=>{
    try{ await navigator.clipboard.writeText(url); toast('Link copied', 'success') } catch{ toast('Could not copy', 'error') }
  }
  const toggleSaved = ()=>{
    try{
      const item = { title, slug, url, ts: Date.now() }
      const list = JSON.parse(localStorage.getItem('readingList')||'[]')
      const idx = list.findIndex(x=>x.slug===slug)
      if(idx===-1){
        list.unshift(item)
        localStorage.setItem('readingList', JSON.stringify(list.slice(0,200)))
        setIsSaved(true)
        toast('Saved', 'success')
      }else{
        list.splice(idx,1)
        localStorage.setItem('readingList', JSON.stringify(list))
        setIsSaved(false)
        toast('Removed', 'info')
      }
      try{ window.dispatchEvent(new CustomEvent('readingListUpdated')) }catch{}
    }catch{ toast('Action failed', 'error') }
  }
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="chip text-sm">Wikipedia</div>
        <div className="chip text-sm">{readMins} min read</div>
  <Button onClick={copy} variant="primary" className="h-8 px-3 text-sm dark:text-white">Copy link</Button>
  <Button onClick={toggleSaved} className="h-8 px-3 text-sm">{isSaved ? 'Unsave' : 'Save'}</Button>
      </div>
      <h1 className="text-3xl font-extrabold mt-3">{title}</h1>
      {excerpt && <p className="mt-2 text-[var(--muted)]">{excerpt}</p>}
    </header>
  )
}
