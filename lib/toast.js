'use client'

export function toast(message, type = 'info', opts = {}){
  try{
    const id = Date.now() + Math.random()
    const detail = { id, message, type, ...opts }
    window.dispatchEvent(new CustomEvent('toast', { detail }))
    return id
  }catch{
    // noop
  }
}
