'use client'
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'

export default function ConvertHero(){
  const [url,setUrl]=useState('')
  const [q,setQ]=useState('')
  const [results,setResults]=useState([])
  const [showDrop,setShowDrop]=useState(false)
  const [loading,setLoading]=useState(false)
  const [highlight,setHighlight]=useState(-1)
  const dropRef = useRef(null)
  const router = useRouter()

  function extractTitle(u){
    try{
      const parsed = new URL(u)
      if(parsed.hostname.includes('wikipedia.org')){
        const parts = parsed.pathname.split('/');
        return parts.pop() || parts.pop()
      }
    }catch(e){ return null }
    return null
  }

  const onSubmit = (e)=>{
    e.preventDefault()
    const title = extractTitle(url)
    if(title) router.push(`/view/${encodeURIComponent(title)}`)
    else alert('Please paste a valid Wikipedia article URL')
  }

  useEffect(()=>{
    if(!q){ setResults([]); setShowDrop(false); return }
    setLoading(true)
    const t = setTimeout(async ()=>{
      try{
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
        const data = await res.json()
        setResults(data.results||[])
        setShowDrop(true)
        setHighlight(-1)
      }catch{}
      finally{ setLoading(false) }
    }, 200)
    return ()=>clearTimeout(t)
  },[q])

  const onSelect = (title, key)=>{
    const dest = key || title
    if(!dest) return
    router.push(`/view/${encodeURIComponent(dest)}`)
  }

  useEffect(()=>{
    const onClickOutside = (e)=>{
      if(dropRef.current && !dropRef.current.contains(e.target)){
        setShowDrop(false)
      }
    }
    document.addEventListener('click', onClickOutside)
    return ()=>document.removeEventListener('click', onClickOutside)
  },[])

  return (
    <div className="w-full">
      <div className="notes-card bg-white dark:bg-[var(--bg)] p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Read Wikipedia without the clutter</h2>

        {/* Direct search */}
        <div className="mb-6 relative" ref={dropRef}>
          <label className="block text-sm font-semibold mb-2 text-[var(--muted)]">Search Wikipedia</label>
          <Input
            value={q}
            onChange={e=>setQ(e.target.value)}
            onFocus={()=>q && setShowDrop(true)}
            onKeyDown={(e)=>{
              if(!showDrop || results.length===0) return
              if(e.key==='ArrowDown'){ e.preventDefault(); setHighlight(h=>Math.min(results.length-1, h+1)) }
              else if(e.key==='ArrowUp'){ e.preventDefault(); setHighlight(h=>Math.max(-1, h-1)) }
              else if(e.key==='Enter'){
                e.preventDefault()
                const pick = results[highlight] || results[0]
                if(pick) onSelect(pick.title, pick.key)
              }
            }}
            placeholder="Type a topic, e.g. Albert Einstein"
          />
          {showDrop && (
            <div className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-auto notes-card bg-white dark:bg-[var(--bg)] border animate-in fade-in-0 zoom-in-95 duration-150">
              {loading && <div className="px-3 py-2 text-sm text-gray-500">Searching…</div>}
              {!loading && results.length===0 && <div className="px-3 py-2 text-sm text-gray-500">No results</div>}
              {!loading && results.map((r,idx)=>
                <button
                  key={r.title+idx}
                  className={`w-full text-left px-3 py-2 border-b last:border-0 hover:bg-gray-50 dark:hover:bg-[#0f141b] ${idx===highlight ? 'bg-gray-50 dark:bg-[#0f141b]' : ''}`}
                  onClick={()=>onSelect(r.title, r.key)}
                >
                  <div className="font-medium truncate" title={r.title}>{r.title}</div>
                  {r.description && <div className="text-xs text-gray-500 truncate" title={r.description}>{r.description}</div>}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Paste URL convert */}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--muted)]">Or paste a Wikipedia URL</label>
          <Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://en.wikipedia.org/wiki/Albert_Einstein" />
          <div className="flex gap-2">
            <Button variant="primary">Convert</Button>
            <a className={buttonVariants({ variant: 'default', size: 'default' })} href="/saved">Saved</a>
          </div>
        </form>
      </div>
    </div>
  )
}
