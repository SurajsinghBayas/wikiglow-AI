'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'

export default function SavedPage(){
  const [items,setItems] = useState([])

  const load = ()=>{
    try{ setItems(JSON.parse(localStorage.getItem('readingList')||'[]')) }catch{ setItems([]) }
  }
  useEffect(()=>{
    load()
    const onUpdate = ()=>load()
    window.addEventListener('readingListUpdated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return ()=>{
      window.removeEventListener('readingListUpdated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  },[])

  const removeOne = (slug)=>{
    try{
      const list = JSON.parse(localStorage.getItem('readingList')||'[]')
      const next = list.filter(x=>x.slug!==slug)
      localStorage.setItem('readingList', JSON.stringify(next))
      setItems(next)
      try{ window.dispatchEvent(new CustomEvent('readingListUpdated')) }catch{}
      toast('Removed', 'info')
    }catch{ toast('Remove failed', 'error') }
  }
  const clearAll = ()=>{
    try{
      localStorage.setItem('readingList', '[]')
      setItems([])
      try{ window.dispatchEvent(new CustomEvent('readingListUpdated')) }catch{}
      toast('Cleared all', 'success')
    }catch{ toast('Clear failed', 'error') }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Saved pages</h1>
        {items.length>0 && <Button onClick={clearAll} className="h-9 px-3">Clear all</Button>}
      </div>

      {items.length===0 ? (
        <div className="text-[var(--muted)]">No saved pages yet. Open an article and click Save.</div>
      ) : (
        <div className="overflow-auto notes-card bg-white dark:bg-[var(--bg)] p-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Saved</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it,idx)=>{
                const d = it.ts ? new Date(it.ts) : null
                const when = d ? d.toLocaleString() : '-'
                return (
                  <tr key={(it.slug||it.title)+idx} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      <a href={`/view/${encodeURIComponent(it.slug||it.title)}`} className="underline hover:opacity-80" title={it.title}>{it.title}</a>
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell text-[var(--muted)]">{when}</td>
                    <td className="px-4 py-2 text-right">
                      <a href={`/view/${encodeURIComponent(it.slug||it.title)}`} className="mr-3 underline">View</a>
                      <button onClick={()=>removeOne(it.slug||it.title)} className="underline text-red-600 dark:text-red-400">Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
