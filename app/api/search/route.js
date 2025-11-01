export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function fetchJson(url){
  const r = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en',
      'User-Agent': 'WikiGlow/0.1 (+https://github.com/; contact: dev@wikiglow.local)'
    }
  })
  if(!r.ok){
    const text = await r.text().catch(()=> '')
    throw new Error(`fetch failed ${r.status}: ${text?.slice(0,200)}`)
  }
  return r.json()
}

function stripTags(html=''){
  return html.replace(/<[^>]*>/g,'').replace(/&[^;]+;/g,' ').trim()
}

export async function GET(req){
  try{
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const limit = Math.min(25, Math.max(1, Number(searchParams.get('limit')||10)))
    if(!q) return new Response(JSON.stringify({ error: 'missing q' }), { status: 400 })

    let results = []

    // 1) Try REST v1 search/title
    try{
      const data = await fetchJson(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(q)}&limit=${limit}`)
      if(Array.isArray(data?.pages) && data.pages.length){
        results = data.pages.map(p=>({ title: p.title || p.key, key: p.key || (p.title||'').replace(/\s+/g,'_'), description: p.description || '' }))
      }
    }catch{ /* try next */ }

    // 2) Fallback to REST v1 search/page
    if(results.length === 0){
      try{
        const data2 = await fetchJson(`https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(q)}&limit=${limit}`)
        if(Array.isArray(data2?.pages) && data2.pages.length){
          results = data2.pages.map(p=>({ title: p.title || p.key, key: p.key || (p.title||'').replace(/\s+/g,'_'), description: p.description || stripTags(p.excerpt||'') }))
        }
      }catch{ /* try next */ }
    }

    // 3) Fallback to MediaWiki API search list
    if(results.length === 0){
      try{
        const mw = await fetchJson(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(q)}&srlimit=${limit}&utf8=1&formatversion=2&origin=*`)
        const items = mw?.query?.search || []
        results = items.map(i=>({ title: i.title, key: (i.title||'').replace(/\s+/g,'_'), description: stripTags(i.snippet||'') }))
      }catch{ /* finally */ }
    }

    return new Response(JSON.stringify({ results }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }catch(e){
    return new Response(JSON.stringify({ error: e.message, results: [] }), { status: 200 })
  }
}
