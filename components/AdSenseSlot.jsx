'use client'
import { useEffect, useRef } from 'react'

/**
 * AdSense responsive slot.
 * Renders only when `show` is true and a client id is configured.
 * In development, enables test ads to avoid policy violations.
 */
export default function AdSenseSlot({
  slot,
  show = true,
  className = '',
  style = {},
  format = 'auto',
  layout = '',
  fullWidthResponsive = true,
}){
  const pushedRef = useRef(false)
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const isDev = process.env.NODE_ENV !== 'production'

  useEffect(()=>{
    if(!show || !client || !slot) return
    // Push once per mount
    if(pushedRef.current) return
    try{
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({})
      pushedRef.current = true
    }catch(e){
      // Swallow errors if the script hasn't loaded yet; retry on next render
      // Optionally, we could set a timeout to retry once.
      // console.debug('adsbygoogle push failed', e)
    }
  },[show, client, slot])

  if(!show || !client || !slot){
    return null
  }

  const baseStyle = { display: 'block', ...style }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={baseStyle}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { 'data-ad-layout': layout } : {})}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      {...(isDev ? { 'data-adtest': 'on' } : {})}
    />
  )
}
