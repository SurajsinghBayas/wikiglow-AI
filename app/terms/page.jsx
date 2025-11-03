export const metadata = { title: 'Terms of Use — WikiGlow' }

export default function TermsPage(){
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-extrabold mb-4">Terms of Use</h1>
      <div className="prose prose-slate dark:prose-invert">
        <p>By using this site, you agree to these terms.</p>
        <h2>Content</h2>
        <p>
          This project renders content from Wikipedia. We are not affiliated with Wikipedia or the Wikimedia
          Foundation. Article content is provided under their respective licenses.
        </p>
        <h2>Acceptable Use</h2>
        <ul>
          <li>No illegal, harmful, or abusive activity.</li>
          <li>No attempts to disrupt or overload the service.</li>
          <li>No scraping for the purpose of republishing content without attribution.</li>
        </ul>
        <h2>Disclaimer</h2>
        <p>
          This site is provided “as is” without warranties of any kind. Use at your own risk.
        </p>
      </div>
    </main>
  )
}
