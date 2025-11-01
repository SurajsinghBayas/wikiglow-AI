'use client'
import { useEffect } from 'react'
import { loadSettings, applySettings } from '@/lib/settings'

export default function ClientBoot(){
  useEffect(()=>{
    // Apply current settings on mount
    const s = loadSettings()
    applySettings(s)

    const onStorage = (e)=>{
      if(e.key === 'readerSettings'){
        applySettings(loadSettings())
      }
    }
    const onUpdated = (e)=>{
      const detail = e.detail
      applySettings(detail || loadSettings())
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('settingsUpdated', onUpdated)
    return ()=>{
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('settingsUpdated', onUpdated)
    }
  },[])
  return null
}
