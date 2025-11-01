import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import ConvertHero from '@/components/ConvertHero'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home(){
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      {/* Hero */}
      <section className="pt-10 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="accent" className="mb-3">New: One‑click AI summaries</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">Read Wikipedia beautifully</h1>
          <p className="mt-3 text-[var(--muted)] text-base sm:text-lg">Clean typography, themes, sticky TOC, reader controls, AI summaries, and polished tables—just the content.</p>
        </div>
        <div className="max-w-3xl mx-auto mt-8">
          <ConvertHero />
        </div>
      </section>

      {/* Features */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {t:'AI Summary', d:'Toggle between the original article and a concise, well‑formatted summary with bullet points.'},
            {t:'Reader controls', d:'Choose font and size; your preferences persist across sessions and devices.'},
            {t:'Themes', d:'Light, Sepia, and Dark with careful color tokens for great contrast.'},
            {t:'Sticky TOC', d:'Dynamic “On this page” with active section highlighting and smooth scroll.'},
            {t:'Search & Convert', d:'Fast in-app search or paste any Wikipedia URL.'},
            {t:'Saved list', d:'Save, remove, and clear pages—synced everywhere.'},
            {t:'Polished tables & media', d:'Zebra rows, borders, and responsive infoboxes that don’t overflow.'},
          ].map((f,i)=>
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">{f.t}</CardTitle>
                <CardDescription>{f.d}</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-4 pb-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          {[{n:1,t:'Find an article',d:'Search inside the app or paste any Wikipedia URL.'},{n:2,t:'Read in comfort',d:'Clean layout, sticky TOC, reader controls, and a distraction‑free page.'},{n:3,t:'Toggle summary',d:'Switch to an AI summary to skim the key ideas as paragraphs and bullet points.'}].map((s,i)=>
            <Card key={i}>
              <CardContent className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-[var(--accent)] text-black flex items-center justify-center mt-1 font-semibold">{s.n}</div>
                <div>
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-[var(--muted)] text-sm mt-1">{s.d}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

  <SiteFooter />
    </div>
  )
}
