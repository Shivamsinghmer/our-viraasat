# Virasat

A digital exhibition of India's built and living heritage, built for the
Thematic Website Development Competition 2026, theme *Code for the Nation*.

Every one of India's 45 inscribed UNESCO World Heritage properties is
documented here, alongside the eight classical dance forms recognised by the
Sangeet Natak Akademi and a chronology running from the Indus Valley to 1947.
All photography is openly licensed, self-hosted, and attributed to the file it
came from.

---

## Contents

- [The site](#the-site)
- [Stack](#stack)
- [Running it](#running-it)
- [Content model](#content-model)
- [Imagery pipeline](#imagery-pipeline)
- [Rendered set pieces](#rendered-set-pieces)
- [Motion and the entry sequence](#motion-and-the-entry-sequence)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Licensing and attribution](#licensing-and-attribution)
- [Project layout](#project-layout)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## The site

| Route | What it is |
|---|---|
| `/` | Landing page: entry sequence, depth-parallax hero, the point-cloud globe, typographic set pieces |
| `/monuments` | All 46 property entries — eleven set out at length, the rest in a grid |
| `/monuments/$slug` | Detail page per property |
| `/arts` | The eight classical dance forms, as a staggered photographic mosaic |
| `/arts/$slug` | Detail page per form |
| `/timeline` | Eight eras, each leading with its photograph and carrying its own extent marked on a shared to-scale axis from 2600 BCE to 1947 |
| `/timeline/$slug` | Detail page per era |
| `/india` | Reference page: geography, the 22 scheduled languages, intangible heritage, national symbols |
| `/credits` | Full photographic attribution, grouped by subject |

The three detail routes share one template (`detail-layout.tsx`) rather than
three copies of the same skeleton.

## Stack

| | |
|---|---|
| Framework | TanStack Start · React 19 |
| Routing | TanStack Router (file-based, auto code-split) |
| Server | Nitro 3 |
| Styling | Tailwind CSS v4 |
| Motion | GSAP · Framer Motion · Lenis |
| Graphics | OGL (WebGL) |
| Build | Vite 8 · Rolldown |
| Tooling | Biome · TypeScript |
| Images | sharp |

Built against Node 24 and npm 11.

## Running it

```bash
npm install
```

```bash
npm run dev
```

The dev server runs at `http://localhost:3000`.

```bash
npm run build
```

```bash
npm run check
```

`npm run check` runs Biome's linter and formatter together. `npm run lint` and
`npm run format` run them separately, and `npm run generate-routes` regenerates
`routeTree.gen.ts` by hand if the plugin's watcher is not running.

## Content model

`src/lib/heritage.ts` holds the entire content model as typed data — no CMS, no
network at runtime.

| Export | Count | Notes |
|---|---|---|
| `monuments` | 11 | Set out at length on `/monuments`, with history, architecture and significance |
| `additionalMonuments` | 35 | Every remaining property, in the same shape |
| `allMonuments` | 46 | The 45 inscribed properties plus Meenakshi, which is on the tentative list |
| `danceForms` | 8 | Origin, technique, repertoire, transmission |
| `timeline` | 8 | Period, what survives, what does not, significance |
| `UNESCO_SITE_COUNT` | 45 | Used in copy so the number cannot drift from the data |

Natural properties carry a `landscape` field where cultural ones carry
`architecture`, because habitat is not architecture.

The eight eras are placed on a single axis rather than spaced evenly. The
legend and every era's own bar share one scale and one set of gridlines, so
scrolling reads as one continuous measure with the extents moving left to right
across it: the Indus block is wide and sits at the far left, Independence is a
tick at the right edge, and the stretches with nothing on them are as much of
the record as the entries.

`src/lib/india.ts` holds the reference material behind `/india`: land and
population figures, the regions, the 15 UNESCO intangible-heritage elements,
and the national symbols.

## Imagery pipeline

Nothing is hotlinked. Every photograph is downloaded, resized, credited and
committed, so the site renders identically offline and its licensing can be
checked against the original Commons file page.

```bash
node scripts/fetch-commons.mjs
```

Sources the photography from Wikimedia Commons. **Free licences only** —
anything without a Creative Commons, CC0 or public-domain declaration is skipped
rather than assumed. It paces itself and backs off, because Commons throttles
hard and a naive loop earns a wall of 429s, and runs are resumable, because a
full pass takes long enough that finishing in one go is not something to rely
on. Pass one or more slugs to refresh just those subjects:

```bash
node scripts/fetch-commons.mjs taj-mahal konark
```

```bash
node scripts/resize-images.mjs
```

Writes a 480px `-480.jpg` derivative beside each original. This matters more
than it sounds: Commons hands back 1200px files averaging 336 KB, and most of
the site displays them far smaller — 48px credit thumbnails, 220px cards, 200px
gallery tiles. Serving originals into those boxes made `/credits` alone pull
99 MB to paint 302 thumbnails. Add `--force` to rebuild everything.

### The credits file is the source of truth

`src/lib/image-credits.json` is written by the fetch script at the moment each
file lands on disk, so it is the only record that cannot drift out of step with
what is actually there. Galleries and hero images resolve through it:

| Helper | Returns |
|---|---|
| `galleryFor(slug)` | Every image for a subject, in fetch order |
| `heroFor(slug)` | The lead image, or `null` |
| `restFor(slug)` | Everything except the lead |
| `smallFile(file)` | Path to the 480px derivative |
| `srcSetFor(file)` | `"…-480.jpg 480w, ….jpg 1200w"` |

Because pages resolve from the credits file rather than from hand-written
paths, a subject whose fetch failed renders without a photograph instead of
with a broken one.

## Rendered set pieces

Four rendered pieces, each with a job rather than decoration.

- **Point-cloud globe** (`components/globe/`) locates India, lit as the flag:
  navy body, saffron rim and atmosphere, green land. Land comes from an
  equirectangular mask rasterised from Natural Earth coastlines.
- **Depth parallax** (`components/fake-3d-image-scene.tsx`) drives the hero
  photograph off a depth map, with a ripple transition when the frame changes.
- **Embroidery patches** (`components/embroidery/`) derive satin-stitch run
  angles from the gradient of a blurred glyph field, so stitches follow each
  stroke.
- **Design tiles** (`components/design-tiles/`) lay a line of type out as
  adjacent solid-colour blocks. SVG, not WebGL.

Plus the **transition curtain** (`components/page-transition.tsx`): a shader
band that sweeps across on route change, gaussian at its edges and banded as
the tricolour. It is modelled on glimm, which is Next-only — its peer dependency
is `next >= 14` and its adapter drives the Next router — so the effect is
reimplemented here on the OGL already in the bundle.

Every GL scene caps device pixel ratio, pauses on `IntersectionObserver` and on
`visibilitychange`, and drops its context on unmount via
`WEBGL_lose_context`. Four live contexts on one page is otherwise a lot to ask
of a phone, and browsers force-lose the oldest context past roughly sixteen.

The globe caps its shader at 16 markers on purpose. Each element of a uniform
array occupies a full vec4 slot, so `uMarkerData[N]` plus `uMarkerColor[N]`
costs 2N of the fragment shader's budget — at N=128 that is around 270 vec4,
comfortable against the 1024+ desktop GPUs report and well over the 224 that
Adreno and Mali commonly cap `MAX_FRAGMENT_UNIFORM_VECTORS` at.

## Motion and the entry sequence

The preloader plays on every full page load, then hands over to the floating
nav. `src/lib/intro.ts` coordinates the hand-off, because the preloader lives in
the root shell and the hero lives in the route — they are siblings with no
shared state, and the hero copy is *in* the viewport the whole time the
preloader covers it, so an `IntersectionObserver` would fire before anyone could
see the animation.

Lenis smooth scroll is driven off the GSAP ticker so both share one rAF rather
than competing for frames.

**Animation never gates content or navigation.** Both the entry sequence and the
transition curtain are driven by GSAP, which advances on `requestAnimationFrame`
— and rAF stops dead in a backgrounded or throttled tab. Each therefore has a
frame-independent escape hatch:

- The preloader hands over immediately if the document is already hidden (a link
  opened in a background tab), immediately on `visibilitychange`, and otherwise
  under an 8-second ceiling. Asking for reduced motion skips it outright.
- The curtain performs its navigation on a timer, with the timeline callback
  kept as the fast path when frames are flowing, and takes itself down under a
  failsafe that kills the timeline first — a starved timeline still holds the
  backdrop opaque and would re-assert it on the next tick to arrive.

Without those, a stalled frame loop left the site unclickable and unscrollable
behind an opaque overlay.

## Performance

- **Images are immutable.** A file at `/images/heritage/konark/03.jpg` never
  changes; it is only ever added to. It is served `max-age=31536000, immutable`,
  declared both as a nitro route rule in `vite.config.ts` and in `vercel.json`.
  Without it the host revalidates roughly three hundred files on every
  navigation.
- **Reveals animate opacity, not `autoAlpha`.** GSAP's `autoAlpha` also sets
  `visibility: hidden`, and Chrome will not begin a `loading="lazy"` image
  inside a hidden subtree — so every photograph below the fold used to wait for
  its own scroll reveal before it started downloading.
- **Cards and tiles resolve the 480px derivative**; only heroes and the lightbox
  load the 1200px original.
- Routes are code-split automatically. The client bundle is ~235 KB gzip, with
  the content model as a separate ~54 KB chunk.
- Devtools are stripped from production builds.

## Accessibility

- `prefers-reduced-motion` is respected throughout: the preloader is skipped
  entirely, `Reveal` returns before building its tween, the transition curtain
  does not initialise, and hover crossfades drop their transform.
- All images carry meaningful alt text — identification, not decoration. Purely
  decorative frames are `alt=""` and `aria-hidden`.
- Semantic HTML with proper heading hierarchy and landmark regions. The
  timeline is an `<ol>`, the dance forms a `<ul>`, each photograph a `<figure>`.
- Keyboard navigable: the hero control is a real `<button>`, the globe toggle
  uses `aria-pressed`, all nav links are focusable.
- Sanskrit and Hindi text uses Noto Serif Devanagari.
- No content is gated behind hover or click. Hover enhances; it never reveals
  something otherwise unavailable.

## Licensing and attribution

302 credited photographs across 62 subjects, 99 MB of originals.

| Licence | Files |
|---|---|
| CC BY-SA 4.0 | 219 |
| CC BY 3.0 | 17 |
| CC BY-SA 3.0 | 16 |
| CC BY 4.0 | 15 |
| CC0 | 11 |
| CC BY 2.0 | 11 |
| CC BY-SA 2.0 | 9 |
| Public domain | 3 |
| CC BY 2.5 | 1 |

Author, licence and a link back to the Commons file page are recorded for every
file and surfaced at `/credits`, which groups by subject and reports the
licences actually in use rather than asserting a policy.

## Project layout

```
src/
  components/
    globe/            point-cloud globe (WebGL)
    embroidery/       satin-stitch patches (WebGL)
    design-tiles/     typographic colour blocks (SVG)
    fake-3d-image*    depth-map parallax (WebGL)
    page-transition   route-change curtain (WebGL)
    preloader, site-preloader, floating-menu, reveal, …
  lib/
    heritage.ts       the content model
    india.ts          reference material
    gallery.ts        resolves images from the credits file
    image-credits.json  written by the fetch script
    site-images.ts, intro.ts, gsap.ts, color.ts, typer.ts
  routes/             file-based routes
scripts/
  fetch-commons.mjs   Wikimedia Commons pipeline
  resize-images.mjs   480px derivatives
  commons-manifest.json
public/
  images/             self-hosted photography
```

## Deployment

Builds to `.output/` via Nitro and deploys on Vercel with no additional
configuration beyond `vercel.json`, which carries the image cache headers.

```bash
npm run build
```

```bash
npx vite preview
```

Note that `@tanstack/*` packages are pinned only to `latest` in `package.json`.
`npm ci` honours the lockfile, but a plain `npm install` in CI can move those
packages independently of one another — the Start runtime and its plugin
expect matching versions, and a mismatch surfaces as a `MISSING_EXPORT` build
failure rather than anything obvious. Pin them before relying on a fresh CI
install.
