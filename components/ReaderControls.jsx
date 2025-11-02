'use client'
import {useState,useEffect} from 'react'
import { Button } from '@/components/ui/button'
import { loadSettings, saveSettings, applySettings } from '@/lib/settings'
import { toast } from '@/lib/toast'

export default function ReaderControls({ targetSelector = 'body' }){
  const [font,setFont]=useState('Poppins')
  const [size,setSize]=useState(17)
  const [theme,setTheme]=useState('light') // 'light' | 'sepia' | 'dark'
  const [saved,setSaved]=useState([])

  // Apply settings to DOM and persist
  useEffect(()=>{
    const next = saveSettings({ theme, font, size })
    applySettings(next)
  },[font,size,theme])

  // Hydrate settings on mount
  useEffect(()=>{
    const s = loadSettings()
    setFont(s.font)
    setSize(s.size)
    setTheme(s.theme)

    // keep in sync with external changes (e.g., Navbar theme cycle)
    const onUpdated = (e)=>{
      const d = e.detail || loadSettings()
      setTheme(d.theme)
    }
    window.addEventListener('settingsUpdated', onUpdated)
    return ()=>window.removeEventListener('settingsUpdated', onUpdated)
  }, [])

  // Load saved list and refresh on updates or storage events
  useEffect(()=>{
    const load = ()=>{
      try{ setSaved(JSON.parse(localStorage.getItem('readingList')||'[]')) }catch{ setSaved([]) }
    }
    load()
    const onUpdate = ()=>load()
    window.addEventListener('readingListUpdated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return ()=>{
      window.removeEventListener('readingListUpdated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  },[])

  const removeSaved = (slug)=>{
    try{
      const list = JSON.parse(localStorage.getItem('readingList')||'[]')
      const next = list.filter(x=>x.slug!==slug)
      localStorage.setItem('readingList', JSON.stringify(next))
      setSaved(next)
      try{ window.dispatchEvent(new CustomEvent('readingListUpdated')) }catch{}
      toast('Removed', 'info')
    }catch{ toast('Remove failed', 'error') }
  }

  const clearAll = ()=>{
    try{
      localStorage.setItem('readingList', '[]')
      setSaved([])
      try{ window.dispatchEvent(new CustomEvent('readingListUpdated')) }catch{}
      toast('Cleared saved list', 'success')
    }catch{ toast('Clear failed', 'error') }
  }

  return (
  <div className="fixed top-24 right-[1cm] p-4 bg-white dark:bg-[var(--bg)] border notes-card w-64 h-min z-30 hidden lg:block">
      <div className="flex flex-col gap-2">
        <div className="font-semibold flex items-center gap-2 px-2 py-1 border rounded shadow-notes"><span>Aa</span> <span className="uppercase">{font}</span></div>
        <select value={font} onChange={e=>setFont(e.target.value)} className="p-2 border rounded">
          <optgroup label="Sans">
            <option value="Poppins">Poppins</option>
            <option value="Inter">Inter</option>
            <option value="Lexend">Lexend</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
            <option value="Excon">Excon</option>
          </optgroup>
          <optgroup label="Serif">
            <option value="Lora">Lora</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Source Serif 4">Source Serif 4</option>
          </optgroup>
        </select>
        <div className="flex items-center justify-between">
          <Button title="Decrease" onClick={()=>setSize(s=>Math.max(12,s-1))} className="h-8 w-8 px-0">-</Button>
          <div className="text-sm text-gray-600">{size}px</div>
          <Button title="Increase" onClick={()=>setSize(s=>Math.min(36,s+1))} className="h-8 w-8 px-0">+</Button>
        </div>
        {/* Theme toggle */}
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={()=>setTheme('light')} className={`h-8 px-2 ${theme==='light' ? 'bg-[var(--accent)] text-black' : ''}`}>Light</Button>
          <Button onClick={()=>setTheme('sepia')} className={`h-8 px-2 ${theme==='sepia' ? 'bg-[var(--accent)] text-black' : ''}`}>Sepia</Button>
          <Button onClick={()=>setTheme('dark')} className={`h-8 px-2 ${theme==='dark' ? 'bg-[var(--accent)] text-black' : ''}`}>Dark</Button>
        </div>

        {/* Saved list */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-semibold text-[var(--muted)]">Saved</div>
            {saved && saved.length>0 && (
              <button onClick={clearAll} className="text-xs underline text-[var(--muted)] hover:text-[var(--text)]">Clear all</button>
            )}
          </div>
          {(!saved || saved.length===0) && (
            <div className="text-xs text-[var(--muted)]">No saved pages</div>
          )}
          {saved && saved.length>0 && (
            <div className="max-h-48 overflow-auto pr-1 space-y-1">
              {saved.map((it,idx)=>
                <div key={(it.slug||it.title)+idx} className="flex items-center gap-2">
                  <a href={`/view/${encodeURIComponent(it.slug||it.title)}`} className="flex-1 px-2 py-1 border rounded shadow-notes bg-white dark:bg-[var(--bg)] text-sm truncate hover:translate-y-[1px]" title={it.title}>
                    {it.title}
                  </a>
                  <button onClick={()=>removeSaved(it.slug||it.title)} className="text-xs text-[var(--muted)] underline hover:text-[var(--text)]">Remove</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
