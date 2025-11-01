'use client'
import {useEffect,useState,useRef} from 'react'
import {useParams, useSearchParams} from 'next/navigation'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ReaderControls from '@/components/ReaderControls'
import ArticleHeader from '@/components/ArticleHeader'
import Footer from '@/components/Footer'
import MobileDock from '@/components/MobileDock'
import AdSenseSlot from '@/components/AdSenseSlot'

export default function ViewPage(){
  const params = useParams()
  const slug = params?.slug
  const [html,setHtml]=useState('')
  const [meta,setMeta]=useState({})
  const [sections,setSections]=useState([])
  const [active,setActive]=useState('')
  const [mode, setMode] = useState('original') // 'original' | 'summary'
  const [summary, setSummary] = useState('')
  const [summaryHtml, setSummaryHtml] = useState('')
  const [summarizing, setSummarizing] = useState(false)
  const articleRef = useRef(null)

  useEffect(()=>{
    if(!slug) return
    const fetcher = async ()=>{
      const res = await fetch(`/api/fetch-wiki?title=${encodeURIComponent(slug)}`)
      if(res.ok){
        const data = await res.json()
        setHtml(data.html)
        setMeta(data.meta||{})
        setSections(data.sections||[])
      }else{
        setHtml('<p>Failed to fetch article</p>')
      }
    }
    fetcher()
  },[slug])

  // Build a plain text payload from the sanitized HTML
  const extractText = (html)=>{
    try{
      const tmp = document.createElement('div')
      tmp.innerHTML = html || ''
      // drop obvious non-content elements if they slipped through
      tmp.querySelectorAll('script,style,nav,footer,header,aside,.reference,.ref,.mw-references-wrap').forEach(n=>n.remove())
      const text = (tmp.textContent||'').replace(/\s+/g,' ').trim()
      return text
    }catch{ return '' }
  }

  const ensureSummary = async ()=>{
    if(summary || summarizing) return
    const text = extractText(html)
    if(!text) return
    setSummarizing(true)
    try{
      const res = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ text, max_length: 230, min_length: 60 }) })
      if(res.ok){
        const data = await res.json()
        setSummary(data.summary||'')
        setSummaryHtml(data.html||'')
      }else{
        setSummary('')
        setSummaryHtml('')
      }
    }catch{
      setSummary('')
      setSummaryHtml('')
    }finally{
      setSummarizing(false)
    }
  }

  // Scroll spy for active heading: use provided sections only and pick the last one above the top offset
  useEffect(()=>{
    if(!sections?.length) return
    const topOffset = 120 // must match CSS scroll-margin and navbar height
    let ticking = false
    const computeActive = ()=>{
      ticking = false
      let currentId = sections[0]?.id || ''
      for(const s of sections){
        const el = document.getElementById(s.id)
        if(!el) continue
        const rect = el.getBoundingClientRect()
        if(rect.top - topOffset <= 0){
          currentId = s.id
        }else{
          break
        }
      }
      setActive(currentId)
    }
    const onScroll = ()=>{
      if(!ticking){
        window.requestAnimationFrame(computeActive)
        ticking = true
      }
    }
    computeActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return ()=>{
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  },[sections])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <div className="mx-auto px-4 sm:px-6 py-10">
        <article
          ref={articleRef}
          className="reader-content notes-card p-6 sm:p-8 lg:p-10 bg-white dark:bg-[var(--bg)] prose prose-slate dark:prose-invert max-w-4xl mx-auto lg:ml-[calc(280px+1cm)] lg:mr-[calc(256px+1cm)]"
        >
          {/* Mode toggle */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={()=> setMode('original')}
              className={`h-8 px-3 rounded border shadow-notes ${mode==='original' ? 'bg-[var(--accent)] text-black' : 'bg-white dark:bg-[var(--bg)]'}`}
            >Original</button>
            <button
              onClick={async ()=>{ setMode('summary'); await ensureSummary() }}
              className={`h-8 px-3 rounded border shadow-notes ${mode==='summary' ? 'bg-[var(--accent)] text-black' : 'bg-white dark:bg-[var(--bg)]'}`}
            >WikiGlow Summary</button>
            {mode==='summary' && summarizing && <span className="text-xs text-[var(--muted)]">Summarizing…</span>}
          </div>
          <ArticleHeader meta={meta} slug={slug} />
          {mode==='original' && (
            <div className="article-body" dangerouslySetInnerHTML={{__html: html}} />
          )}
          {mode==='summary' && (
            <div className="article-body">
              {summaryHtml
                ? <div dangerouslySetInnerHTML={{ __html: summaryHtml }} />
                : summary
                  ? <p>{summary}</p>
                  : (
                    <div>
                      <p className="text-[var(--muted)]">{summarizing ? 'Generating summary…' : 'No summary available.'}</p>
                      {/* Ad only when there's no summary content */}
                      {!summarizing && (
                        <div className="mt-4">
                          <AdSenseSlot
                            show={true}
                            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SUMMARY_EMPTY || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FALLBACK}
                            style={{ minHeight: 120 }}
                          />
                        </div>
                      )}
                    </div>
                  )
              }
            </div>
          )}
          <Footer />
        </article>
        </div>
      <Sidebar sections={sections} activeId={active} articleTitle={meta?.title} />
      <ReaderControls targetSelector=".article-body" />
      <MobileDock sections={sections} articleTitle={meta?.title} />
    </div>
  )
}
