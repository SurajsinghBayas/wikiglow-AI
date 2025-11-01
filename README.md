# WikiGlow

Next.js app to render clean Wikipedia articles in a NotesBuddy-like UI.

Run:

```bash
npm install
npm run dev
```

Optional: enable AI summarization

- Create a `.env.local` file and add your Hugging Face API key:

```bash
HUGGINGFACE_API_KEY=hf_xxx
```

- The app will fall back to a local extractive summary (first-best sentences) when no key is provided.

## Optional: Google AdSense (ads only in empty sections)

To show ads only in places that would otherwise be empty (e.g., no saved items, no summary), configure these public environment variables in `.env.local`:

```bash
# Your AdSense publisher id, required to enable ads
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX

# Individual slot ids for different empty states (use your own or reuse one)
NEXT_PUBLIC_ADSENSE_SLOT_FALLBACK=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SAVED_EMPTY=1234567891
NEXT_PUBLIC_ADSENSE_SLOT_SIDEPANEL_EMPTY=1234567892
NEXT_PUBLIC_ADSENSE_SLOT_SUMMARY_EMPTY=1234567893
```

Notes:
- Ads are rendered only when a section is empty; normal content is never replaced.
- In development (`next dev`) the ads run in test mode automatically via `data-adtest="on"`.
- The AdSense script is loaded only when `NEXT_PUBLIC_ADSENSE_CLIENT` is set.
- If a more specific slot is not set, the code falls back to `NEXT_PUBLIC_ADSENSE_SLOT_FALLBACK`.

### ads.txt on Vercel

This app serves `/ads.txt` from an API route so you don't have to commit a file. Set either:

```bash
# Prefer this server-only env
ADSENSE_ACCOUNT=pub-XXXXXXXXXXXXXXXX
# or reuse the public client id; both "ca-pub-" and "pub-" forms work
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

The handler normalizes to `pub-XXXX` and returns:

```
google.com, pub-XXXX, DIRECT, f08c47fec0942fa0
```

If not configured, it returns a small placeholder text (avoids a 404 on Vercel), but AdSense will require a valid value for verification.
