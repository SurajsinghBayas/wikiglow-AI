# WikiGlow

[![Next.js](https://img.shields.io/badge/Next.js-latest-black?logo=next.js)](https://nextjs.org)
[![HuggingFace](https://img.shields.io/badge/AI-HuggingFace-FFD21E?logo=huggingface)](https://huggingface.co)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Beautiful Wikipedia, reimagined.** WikiGlow renders Wikipedia articles in a clean, NotesBuddy-inspired UI with AI-powered summarization — so you can actually read and learn without the clutter.

---

## Features

- **Clean reader view** — Wikipedia content rendered in a distraction-free, modern interface
- **AI summarization** — HuggingFace-powered article summaries; falls back to local extractive summarization when no key is set
- **Save articles** — bookmark articles to your personal reading list
- **Side panel** — quick-access panel for saved items and summaries
- **AdSense integration** — optional monetization that only appears in genuinely empty sections, never replacing content

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file:

```bash
# AI summarization (optional — falls back to extractive summary if not set)
HUGGINGFACE_API_KEY=hf_xxx

# AdSense (optional)
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_FALLBACK=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SAVED_EMPTY=1234567891
NEXT_PUBLIC_ADSENSE_SLOT_SIDEPANEL_EMPTY=1234567892
NEXT_PUBLIC_ADSENSE_SLOT_SUMMARY_EMPTY=1234567893
```

---

## AI Summarization

WikiGlow uses the HuggingFace Inference API to summarize articles. If `HUGGINGFACE_API_KEY` is not set, the app automatically falls back to a local extractive summarizer (best-sentence extraction) — no degraded experience for the reader.

---

## AdSense

Ads are shown **only in empty states** — sections with no saved items, no summary, or no side panel content. Normal content is never replaced. In development mode (`next dev`), ads run in test mode automatically via `data-adtest="on"`.

For `ads.txt` on Vercel, set `ADSENSE_ACCOUNT` or `NEXT_PUBLIC_ADSENSE_CLIENT`. The app serves `/ads.txt` from an API route — no need to commit a file.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js (App Router)                |
| AI           | HuggingFace Inference API           |
| Fallback AI  | Local extractive summarization      |
| Styling      | Tailwind CSS                        |
| Monetization | Google AdSense (optional)           |

---

Built by [Suraj Bayas](https://github.com/SurajsinghBayas)