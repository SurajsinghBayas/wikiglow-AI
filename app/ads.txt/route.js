'use server'

// Serve Ads.txt at the site root to satisfy AdSense crawler.
// Configure your publisher/account id via ADSENSE_ACCOUNT or reuse NEXT_PUBLIC_ADSENSE_CLIENT.
// Accepts values like "ca-pub-123" or "pub-123" or just the numeric id.

export async function GET(){
  const raw = process.env.ADSENSE_ACCOUNT || process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''
  let id = String(raw || '').trim()
  if(!id){
    // Return an empty-but-valid text payload instead of a 404, so Vercel doesn't serve its platform 404 page.
    return new Response('# ads.txt not configured\n', {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=300'
      }
    })
  }
  // Normalize to pub-XXXXXXXX format expected by ads.txt
  id = id.replace(/^ca-/, '')
  if(!id.startsWith('pub-')) id = `pub-${id}`

  const lines = [
    // Google AdSense authority ID is fixed: f08c47fec0942fa0
    `google.com, ${id}, DIRECT, f08c47fec0942fa0`
  ]

  return new Response(lines.join('\n')+'\n', {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400'
    }
  })
}
