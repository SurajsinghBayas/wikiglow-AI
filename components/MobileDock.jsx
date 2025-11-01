'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { saveSettings, loadSettings, applySettings } from '@/lib/settings'

export default function MobileDock({ sections = [], articleTitle = 'On this page' }){
  const [showTOC,setShowTOC] = useState(false)
  const [showReader,setShowReader] = useState(false)
  const [font,setFont] = useState('Poppins')
  const [size,setSize] = useState(17)
  const [theme,setTheme] = useState('light')

  useEffect(()=>{
    const s = loadSettings()
    setFont(s.font)
    setSize(s.size)
    setTheme(s.theme)
    const onUpdated = (e)=>{
      const d = e.detail || loadSettings()
      setFont(d.font)
      setSize(d.size)
      setTheme(d.theme)
    }
    window.addEventListener('settingsUpdated', onUpdated)
    return ()=>window.removeEventListener('settingsUpdated', onUpdated)
  },[])

  const setThemePersist = (t)=>{ const u = saveSettings({ theme: t }); applySettings(u); setTheme(t) }
  const setFontPersist = (f)=>{ const u = saveSettings({ font: f }); applySettings(u); setFont(f) }
  const setSizePersist = (n)=>{ const u = saveSettings({ size: n }); applySettings(u); setSize(n) }

  return (
    <>
      {/* Bottom dock (mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="mx-auto max-w-3xl px-4 pb-[calc(8px+env(safe-area-inset-bottom))]">
          <div className="notes-card border bg-white dark:bg-[var(--bg)] flex items-center justify-center gap-4 py-2 rounded-t-xl">
            <Button className="h-9 px-4" onClick={()=>{ setShowTOC(true); setShowReader(false) }}>TOC</Button>
            <Button className="h-9 px-4" onClick={()=>{ setShowReader(true); setShowTOC(false) }}>Aa</Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(showTOC || showReader) && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={()=>{ setShowTOC(false); setShowReader(false) }} />
          <div className="absolute left-0 right-0 bottom-0 rounded-t-2xl notes-card bg-white dark:bg-[var(--bg)] border p-4 max-h-[70vh] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{showTOC? (articleTitle || 'On this page') : 'Reader'}</div>
              <button onClick={()=>{ setShowTOC(false); setShowReader(false) }} className="text-sm underline">Close</button>
            </div>
            {showTOC && (
              <div className="space-y-2 pr-1">
                {sections.length===0 && (
                  <div className="text-sm text-[var(--muted)]">No sections</div>
                )}
                {sections.map(s=>
                  <a key={s.id} href={`#${s.id}`} onClick={()=>setShowTOC(false)} className="block border rounded-2xl px-3 py-2 shadow-notes overflow-hidden bg-white dark:bg-[var(--bg)]" style={{marginLeft: (s.level-1)*12}}>
                    <span className="block text-sm leading-snug truncate break-words">{s.text}</span>
                  </a>
                )}
              </div>
            )}

            {showReader && (
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-[var(--muted)] mb-1">Font</div>
                  <select value={font} onChange={(e)=>setFontPersist(e.target.value)} className="w-full p-2 border rounded">
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
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--muted)] mb-1">Size</div>
                  <div className="flex items-center justify-between">
                    <Button onClick={()=>setSizePersist(Math.max(12, size-1))} className="h-8 w-8 px-0">-</Button>
                    <div className="text-sm text-gray-600">{size}px</div>
                    <Button onClick={()=>setSizePersist(Math.min(36, size+1))} className="h-8 w-8 px-0">+</Button>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--muted)] mb-1">Theme</div>
                  <div className="flex items-center gap-2">
                    <Button onClick={()=>setThemePersist('light')} className={`h-8 px-3 ${theme==='light'?'bg-[var(--accent)]':''}`}>Light</Button>
                    <Button onClick={()=>setThemePersist('sepia')} className={`h-8 px-3 ${theme==='sepia'?'bg-[var(--accent)]':''}`}>Sepia</Button>
                    <Button onClick={()=>setThemePersist('dark')} className={`h-8 px-3 ${theme==='dark'?'bg-[var(--accent)]':''}`}>Dark</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
