'use client'
import {useState, useMemo} from 'react'

export default function Sidebar({sections = [], activeId, articleTitle}){
  const [open,setOpen] = useState(false)
  const maxH = 'calc(100vh - 180px)'
  const current = useMemo(()=>sections.find(s=>s.id===activeId),[sections,activeId])
  const label = current?.text || articleTitle || 'On this page'
  return (
  <div className="fixed top-24 left-[1cm] z-30 w-[280px] hidden lg:block">
      <div className="notes-card bg-white">
        <div className="w-full flex items-center justify-between gap-3 px-4 py-3 border-b">
          <span className="font-semibold truncate max-w-[200px] break-words" title={label}>{label}</span>
          <button onClick={()=>setOpen(o=>!o)} className="text-sm px-2 py-1 border rounded shadow-notes bg-white dark:bg-[var(--bg)]">{open? 'Hide' : 'Show'}</button>
        </div>
        {open && (
          <div className="p-3" style={{maxHeight:maxH, overflow:'auto'}}>
            <div className="space-y-2 pr-1">
              {sections.map(s=>{
                const isActive = activeId === s.id
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`block border rounded-2xl px-3 py-2 shadow-notes overflow-hidden ${isActive? 'bg-black text-white' : 'bg-white hover:translate-y-[1px]'} `}
                    style={{marginLeft: (s.level-1)*12}}
                    title={s.text}
                  >
                    <span className="block text-sm leading-snug truncate break-words max-w-[236px]">{s.text}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
