'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Conditionally loads AdSense ONLY on article pages (/view/*) and
 * actively removes any AdSense DOM/script when leaving those pages.
 * This helps ensure no ads render on screens without publisher content.
 */
export default function AdSenseBoot(){
  const pathname = usePathname()
  const injected = useRef(false)

  // Utility: remove AdSense artifacts and script
  const cleanupAds = () => {
    try {
      // Remove common auto-ads containers/elements
      const selectors = [
        'ins.adsbygoogle',
        '[class*="google-auto-placed"]',
        'iframe[id^="google_ads_iframe_"]',
        'div[id^="google_ads_iframe_"]',
        'div[id^="aswift_"]',
        '#google_esf',
      ]
      document.querySelectorAll(selectors.join(',')).forEach((el)=>{
        el.remove()
      })

      // Remove the loader script we injected
      const script = document.querySelector('script[data-wg-adsense="on"]')
      if(script) script.remove()

      // Best-effort reset of the global queue so it won't try to render on non-content pages
      if(typeof window !== 'undefined' && 'adsbygoogle' in window){
        try { window.adsbygoogle = [] } catch {/* ignore */}
      }
    } catch { /* ignore cleanup errors */ }
    injected.current = false
  }

  useEffect(()=>{
    if(!pathname) return

    const allow = pathname.startsWith('/view/')

    if(!allow){
      // Navigated to a non-content page; ensure nothing remains
      cleanupAds()
      return
    }

    // Already injected for this session
    if(injected.current) return

    // Avoid duplicating the script tag across Fast Refresh/SPA transitions
    const existing = document.querySelector('script[data-wg-adsense="on"]')
    if(existing){ injected.current = true; return }

    const client = 'ca-pub-8037321916392892'
    const s = document.createElement('script')
    s.async = true
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
    s.crossOrigin = 'anonymous'
    s.dataset.wgAdsense = 'on'
    document.head.appendChild(s)
    injected.current = true
  },[pathname])

  return null
}
