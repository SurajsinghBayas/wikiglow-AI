export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Simple summarization endpoint.
// Prefers Hugging Face Inference API with facebook/bart-large-cnn when HUGGINGFACE_API_KEY is set.
// Falls back to a lightweight extractive heuristic (first N sentences) when no key is provided.

const HF_MODEL = 'facebook/bart-large-cnn'

function extractiveFallback(text, maxSentences = 5){
  try{
    const clean = (text||'')
      .replace(/\s+/g,' ')
      .replace(/\[[^\]]*\]/g,'') // drop refs like [1]
      .trim()
    if(!clean) return ''
    // naive sentence split
    const parts = clean.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    return parts.slice(0, Math.max(1, maxSentences)).join(' ')
  }catch{
    return (text||'').slice(0, 600)
  }
}

function splitSentences(text){
  try{
    return (text||'')
      .replace(/\s+/g,' ')
      .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
      .map(s=>s.trim())
      .filter(Boolean)
  }catch{ return [] }
}

function pickKeySentences(text, target = 5){
  const sents = splitSentences(text)
  if(sents.length <= target) return sents
  // very light scoring: prefer medium-length sentences with fewer pronouns
  const score = (s)=>{
    const words = s.split(/\s+/).length
    const lenScore = 1 - Math.abs(20 - words)/20 // peak around ~20 words
    const pronounPenalty = /(\b(it|this|that|they|them|he|she|we|you)\b)/i.test(s) ? 0.1 : 0.3
    const commaBonus = (s.match(/,/g)||[]).length * 0.05
    return lenScore + pronounPenalty + commaBonus
  }
  const ranked = sents
    .map((s,i)=>({ s, i, score: score(s) }))
    .sort((a,b)=> b.score - a.score || a.i - b.i)
    .slice(0, target)
    .sort((a,b)=> a.i - b.i) // keep original order
    .map(x=>x.s)
  return ranked
}

function toHtml({ summary, bullets }){
  const esc = (s)=> (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const p = summary ? `<p>${esc(summary)}</p>` : ''
  const ul = bullets && bullets.length
    ? `<ul>${bullets.map(li=>`<li>${esc(li)}</li>`).join('')}</ul>`
    : ''
  const title = `<h2>Summary</h2>`
  const kp = bullets && bullets.length ? `<h3>Key points</h3>` : ''
  return `${title}${p}${kp}${ul}`
}

async function summarizeWithHF(text, { min_length = 60, max_length = 220 } = {}){
  const key = process.env.HUGGINGFACE_API_KEY
  if(!key){
    const summary = extractiveFallback(text)
    const bullets = pickKeySentences(text, 5)
    return { summary, bullets, html: toHtml({ summary, bullets }), provider: 'fallback' }
  }
  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`
  const body = { inputs: text, parameters: { min_length, max_length } }
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if(!r.ok){
    // When the model is loading, HF returns 503; fall back rather than failing hard
    const msg = await r.text().catch(()=> '')
    const summary = extractiveFallback(text)
    const bullets = pickKeySentences(text, 5)
    return { summary, bullets, html: toHtml({ summary, bullets }), provider: 'fallback', note: `hf:${r.status}` }
  }
  const data = await r.json()
  // API returns an array of {summary_text}
  const summary = Array.isArray(data) && data[0]?.summary_text ? data[0].summary_text : extractiveFallback(text)
  const bullets = pickKeySentences(text, 5)
  return { summary, bullets, html: toHtml({ summary, bullets }), provider: 'huggingface' }
}

export async function POST(req){
  try{
    const { text, min_length, max_length } = await req.json()
    if(!text || typeof text !== 'string' || text.trim().length === 0){
      return new Response(JSON.stringify({ error: 'missing text' }), { status: 400 })
    }
    // keep request payload small for serverless
    const maxChars = 8000
    const trimmed = text.slice(0, maxChars)
  const result = await summarizeWithHF(trimmed, { min_length, max_length })
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }catch(e){
    return new Response(JSON.stringify({ error: e?.message || 'failed' }), { status: 500 })
  }
}
