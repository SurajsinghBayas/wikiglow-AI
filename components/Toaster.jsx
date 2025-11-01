'use client'
import { useEffect, useState } from 'react'

export default function Toaster(){
  const [items,setItems] = useState([])

  useEffect(()=>{
    const onToast = (e)=>{
      const detail = e.detail || {}
      const i = { id: detail.id || Date.now(), message: detail.message || '', type: detail.type || 'info' }
      setItems(prev=>[...prev, i])
      const ttl = detail.ttl || 2200
      setTimeout(()=>{
        setItems(prev=>prev.filter(x=>x.id!==i.id))
      }, ttl)
    }
    window.addEventListener('toast', onToast)
    return ()=>window.removeEventListener('toast', onToast)
  },[])

  const sideFor = (t)=> t==='success' ? 'border-l-4 border-emerald-500' : t==='error' ? 'border-l-4 border-red-500' : 'border-l-4 border-slate-400 dark:border-slate-500'

  return (
    <div className="fixed top-[72px] right-4 lg:right-[1cm] z-[60] flex flex-col gap-2">
      {items.map(it=>
        <div key={it.id} className={`notes-card shadow-lg border px-3 py-2 rounded text-[var(--text)] ${sideFor(it.type)}`}>
          <div className="text-sm font-medium leading-snug">{it.message}</div>
        </div>
      )}
    </div>
  )
}
