import { Github } from 'lucide-react'

export default function SiteFooter(){
  const year = new Date().getFullYear()
  return (
    <footer className="border-t mt-8 bg-white dark:bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-extrabold text-lg">WikiGlow</div>
          <p className="text-[var(--muted)] mt-2">A clean, readable Wikipedia experience with themes, controls, and AI summaries.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Product</div>
          <ul className="space-y-1 text-[var(--muted)]">
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="/saved" className="hover:underline">Saved</a></li>
            <li><a href="/convert" className="hover:underline">Convert</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Resources</div>
          <ul className="space-y-1 text-[var(--muted)]">
            <li>
              <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Legal</div>
          <ul className="space-y-1 text-[var(--muted)]">
            <li><a href="/privacy" className="hover:underline">Privacy</a></li>
            <li><a href="/terms" className="hover:underline">Terms</a></li>
            <li className="pt-1">Not affiliated with Wikipedia or the Wikimedia Foundation.</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-[var(--muted)]">
        © {year} WikiGlow
      </div>
    </footer>
  )
}
