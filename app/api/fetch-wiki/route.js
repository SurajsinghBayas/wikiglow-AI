export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { parseHTML } from 'linkedom'

function sanitizeAndShape(html){
  const { document } = parseHTML(html)

  // Remove non-content elements
  const removeSelectors = [
    'script','style','noscript','header','footer',
    '.mwe-popups','.navbox','.vertical-navbox','.sidebar','.mw-jump-link','.metadata','.reference',
    '[role="navigation"]','aside'
  ]
  removeSelectors.forEach(sel=>{
    document.querySelectorAll(sel).forEach(n=>n.remove())
  })

  // Ensure responsive media & tables
  document.querySelectorAll('img').forEach(img=>{
    img.setAttribute('loading','lazy')
    if(!img.getAttribute('alt')) img.setAttribute('alt','')
  })
  document.querySelectorAll('table').forEach(t=>{
    const isInfo = t.classList.contains('infobox') || t.classList.contains('vcard')
    if(!isInfo){
      t.classList.add('wikitable')
      if(t.parentElement && !t.parentElement.classList.contains('table-scroll')){
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class','table-scroll')
        t.parentNode?.insertBefore(wrapper, t)
        wrapper.appendChild(t)
      }
    }
  })
  // Enhance infobox / personal information table UX
  document.querySelectorAll('table.infobox, table.vcard').forEach(t=>{
    // Determine title of the box
    let titleText = ''
    const cap = t.querySelector('caption')
    if(cap) titleText = (cap.textContent||'').trim()
    if(!titleText){
      const firstTh = t.querySelector('tr th')
      if(firstTh) titleText = (firstTh.textContent||'').trim()
    }
    if(/personal information/i.test(titleText)){
      t.classList.add('personal-info')
    }
    // Wrap in a collapsible card for mobile
    const details = document.createElement('details')
    details.setAttribute('class','infobox-card notes-card')
    details.setAttribute('open','')
    const summary = document.createElement('summary')
    summary.textContent = titleText || 'Information'
    details.appendChild(summary)
    t.parentNode?.insertBefore(details, t)
    details.appendChild(t)
  })
  document.querySelectorAll('figure, .thumb').forEach(f=>f.classList.add('wiki-figure'))

  // Generate heading ids and TOC
  const sections = []
  document.querySelectorAll('h1, h2, h3').forEach(h=>{
    const level = Number(h.tagName.substring(1))
    const text = (h.textContent||'').trim()
    if(!text) return
    let id = h.getAttribute('id')
    if(!id){
      id = text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
      h.setAttribute('id', id)
    }
    sections.push({ id, text, level })
  })

  const textContent = (document.body.textContent||'').replace(/\s+/g,' ').trim()
  const words = textContent ? textContent.split(' ').length : 0
  const readMins = Math.max(1, Math.round(words / 200))

  const h1 = document.querySelector('h1')
  const title = h1?.textContent?.trim() || document.title || 'Article'
  let excerpt = ''
  const pEl = Array.from(document.querySelectorAll('p')).find(p=>p.textContent.trim().length>60)
  if(pEl) excerpt = pEl.textContent.trim().slice(0,300)

  // body html
  const contentHtml = document.body.innerHTML
  return { html: contentHtml, meta: { title, excerpt, words, readMins }, sections }
}

export async function GET(req){
  try{
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title')
    if(!title) return new Response(JSON.stringify({error:'missing title'}),{status:400})

    // Normalize: Wikipedia prefers underscores in titles for HTML endpoint
    const safeTitle = title.replace(/\s+/g,'_')
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(safeTitle)}`
  const r = await fetch(wikiUrl, { headers: { 'Accept': 'text/html', 'User-Agent': 'WikiGlow/0.1 (+https://github.com/; contact: dev@wikiglow.local)' } })
    if(!r.ok) return new Response(JSON.stringify({error:'wiki fetch failed'}),{status:502})
  let raw = await r.text()
  const shaped = sanitizeAndShape(raw)
  return new Response(JSON.stringify(shaped), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }catch(e){
    return new Response(JSON.stringify({error:e.message}),{status:500})
  }
}
