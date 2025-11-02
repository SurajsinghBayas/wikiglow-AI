"use client"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loadSettings, saveSettings, applySettings } from '@/lib/settings'

export default function Navbar(){
  const [theme, setTheme] = useState('light') // light | sepia | dark
  const [progress, setProgress] = useState(0)
  const [q,setQ] = useState('')
  const [results,setResults] = useState([])
  const [showDrop,setShowDrop] = useState(false)
  const [loading,setLoading] = useState(false)
  const [highlight,setHighlight] = useState(-1)
  const dropRef = useRef(null)
  const router = useRouter()
  const [savedCount, setSavedCount] = useState(0)
  // Mobile reader controls moved to MobileDock

  // Sync theme with saved settings
  useEffect(()=>{
    const s = loadSettings()
    setTheme(s.theme)
    applySettings(s)
    const onUpdated = (e)=>{
      const d = e.detail || loadSettings()
      setTheme(d.theme)
    }
    window.addEventListener('settingsUpdated', onUpdated)
    return ()=>window.removeEventListener('settingsUpdated', onUpdated)
  },[])
  const setThemeAndApply = (next)=>{
    const updated = saveSettings({ theme: next })
    applySettings(updated)
    setTheme(next)
  }
  // Saved count badge sync
  useEffect(()=>{
    const loadCount = ()=>{
      try{ const list = JSON.parse(localStorage.getItem('readingList')||'[]'); setSavedCount(list.length) }catch{ setSavedCount(0) }
    }
    loadCount()
    const onUpdate = ()=>loadCount()
    window.addEventListener('readingListUpdated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return ()=>{
      window.removeEventListener('readingListUpdated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  },[])

  // Article reading progress bar
  useEffect(()=>{
    const el = document.querySelector('.article-body')
    if(!el) return
    const topOffset = 120
    const compute = ()=>{
      const rectTop = el.getBoundingClientRect().top + window.scrollY
      const start = rectTop - topOffset
      const end = start + el.offsetHeight - (window.innerHeight - topOffset)
      const p = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)))
      setProgress(p)
    }
    compute()
    const onScroll = ()=>compute()
    const onResize = ()=>compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return ()=>{
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  },[])

  // Debounced navbar search
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
      }catch{ /* noop */ }
      finally{ setLoading(false) }
    }, 200)
    return ()=>clearTimeout(t)
  },[q])

  const onSelect = (title, key)=>{
    const dest = key || title
    if(!dest) return
    setShowDrop(false)
    setQ('')
    router.push(`/view/${encodeURIComponent(dest)}`)
  }

  // Close dropdown on outside click
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
    <nav className="w-full px-6 border-b bg-white dark:bg-[var(--bg)] fixed top-0 left-0 right-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-[var(--bg)]/80">
      <div className="max-w-6xl mx-auto h-14 flex items-center gap-3 sm:gap-4">
  <a href="/" className="font-extrabold text-lg mr-auto">WikiGlow</a>

        {/* Navbar search */}
        <div className="relative w-[60vw] sm:w-[320px]" ref={dropRef}>
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
            placeholder="Search Wikipedia…"
          />
          {showDrop && (
            <div
              className="
                fixed inset-x-3 top-16 z-[60] max-h-[70vh] overflow-auto
                notes-card bg-white dark:bg-[var(--bg)] border animate-in fade-in-0 zoom-in-95 duration-150
                sm:absolute sm:inset-auto sm:left-0 sm:right-0 sm:top-auto sm:mt-2 sm:max-h-80
              "
            >
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

  {/* Mobile reader controls moved to MobileDock */}

  <Button onClick={()=>router.push('/saved')} className="ml-1 sm:ml-2 h-9 px-3">
    Saved{savedCount>0 ? ` (${savedCount})` : ''}
  </Button>
  {/* Theme picker keeps Navbar in sync with ReaderControls */}
  <select
    aria-label="Theme"
    value={theme}
    onChange={(e)=>setThemeAndApply(e.target.value)}
    className="ml-1 h-9 px-2 rounded-md border bg-white dark:bg-[var(--bg)] shadow-notes text-sm"
  >
    <option value="light">Light</option>
    <option value="sepia">Sepia</option>
    <option value="dark">Dark</option>
  </select>
      </div>
      {/* Thin progress bar shown only on article pages (computed if .article-body exists) */}
      <div className="h-0.5 bg-transparent">
        <div className="h-0.5 bg-black dark:bg-white transition-[width] duration-150" style={{width: `${Math.round(progress*100)}%`}} />
      </div>
    </nav>
  )
}
