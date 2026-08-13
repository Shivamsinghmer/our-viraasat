# virasat-web

**Virasat** — a digital exhibition of India's built and living heritage. Built
for the Thematic Website Development Competition 2026, theme *Code for the
Nation*.

All 45 of India's UNESCO World Heritage properties are documented here,
alongside the eight classical dance forms recognised by the Sangeet Natak
Akademi and a chronology running from the Indus Valley to 1947.

## Stack

| | |
|---|---|
| Framework | TanStack Start · React 19 |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 |
| Motion | GSAP · Framer Motion · Lenis |
| Graphics | OGL (WebGL) |
| Tooling | Vite · Biome · TypeScript |

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run check    # Biome lint + format
```

## Imagery

Every photograph is self-hosted and openly licensed, sourced from Wikimedia
Commons. Nothing is hotlinked, so the site works without a network and its
licensing can be verified against the original file page.

```bash
node scripts/fetch-commons.mjs    # source imagery (free licences only)
node scripts/resize-images.mjs    # build 480px derivatives
```

`src/lib/image-credits.json` is written by the fetch script and is the single
source of truth for what exists on disk — galleries and hero images resolve
from it, so a page can never point at an image that failed to download. Full
attribution is surfaced at `/credits`.

## Layout

```
src/
  components/   UI, motion and WebGL set pieces
  lib/          content model, imagery index, helpers
  routes/       file-based routes
scripts/        Wikimedia Commons pipeline
public/images/  self-hosted photography
```
