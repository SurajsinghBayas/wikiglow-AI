'use client'

const DEFAULTS = { theme: 'light', font: 'Poppins', size: 17 }

export function loadSettings(){
  try{
    const raw = localStorage.getItem('readerSettings')
    const obj = raw ? JSON.parse(raw) : {}
    return { ...DEFAULTS, ...obj }
  }catch{
    return { ...DEFAULTS }
  }
}

export function saveSettings(patch){
  try{
    const cur = loadSettings()
    const next = { ...cur, ...patch }
    localStorage.setItem('readerSettings', JSON.stringify(next))
    try{ window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: next })) }catch{}
    return next
  }catch{
    return loadSettings()
  }
}

export function applySettings(s){
  try{
    const root = document.documentElement
    root.classList.remove('dark','sepia')
    if(s.theme === 'dark') root.classList.add('dark')
    else if(s.theme === 'sepia') root.classList.add('sepia')

    const el = document.body
    el.style.setProperty('--reader-font-size', (s.size ?? DEFAULTS.size) + 'px')
    el.style.setProperty('--reader-font', s.font || DEFAULTS.font)
    el.style.fontSize = 'var(--reader-font-size)'
    el.style.fontFamily = 'var(--reader-font)'
  }catch{
    // noop
  }
}
