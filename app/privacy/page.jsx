export const metadata = { title: 'Privacy Policy — WikiGlow' }

export default function PrivacyPage(){
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-extrabold mb-4">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert">
        <p>We value your privacy. This page describes what information we collect, how we use it, and your choices.</p>
        <h2>Advertising</h2>
        <p>
          This site uses Google AdSense to display ads. Google may use cookies and similar technologies to serve
          ads and measure their performance. Learn more about how Google uses information at
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer"> policies.google.com/technologies/partner-sites</a>.
        </p>
        <h2>Cookies & Local Storage</h2>
        <p>
          We use local storage to remember your reader preferences (theme, font, and size) and your saved articles.
          You can clear these at any time using your browser settings.
        </p>
        <h2>Consent and Choices</h2>
        <p>
          If you are in the EEA/UK, you may be asked for consent related to cookies and personalized ads. We
          recommend using your browser settings and ad personalization controls provided by Google.
        </p>
        <h2>Contact</h2>
        <p>For any privacy-related questions, please contact us via the project repository.</p>
      </div>
    </main>
  )
}
