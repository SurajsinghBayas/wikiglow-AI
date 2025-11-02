export async function GET(){
  // ads.txt route intentionally simplified; no AdSense-specific content.
  return new Response('', { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=60' } })
}
