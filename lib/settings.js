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

    const fontName = (s.font || DEFAULTS.font)
    const needsQuotes = /\s/.test(fontName)
    const cssFamilyToken = needsQuotes ? `"${fontName}"` : fontName

    // Build a full font-family stack and expose on :root so all components inherit it
    const fullStack = `${cssFamilyToken}, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, serif`

    // Expose as CSS variables on :root (inherited by .article-body etc.)
    root.style.setProperty('--reader-font-size', (s.size ?? DEFAULTS.size) + 'px')
    root.style.setProperty('--reader-font', fullStack)

    // Also set body inline size for immediate effect
    document.body.style.fontSize = 'var(--reader-font-size)'
  }catch{
    // noop
  }
}
