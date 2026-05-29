# now.plura.pt

A static bilingual portfolio, live while the main Plura site is in development.

No framework. Projects are driven by a JSON data file; all UI is rendered client-side.

## Design intent

Minimal and light. Mostly text, generous whitespace, a strict grid. The logo animates in on load; the intro is skipped on return visits and language switches. Everything else stays quiet. The goal is a page that feels considered without trying too hard — a holding page that doesn't look like one.

---

## Stack

- **GSAP** — intro and UI animations
- **Lucide** — icons (CDN, UMD)
- **Rollup + Terser** — JS bundle
- **CleanCSS** — CSS bundle
- **PHPMailer** — contact form backend (`api/`)

## Build

```bash
npm run build   # outputs to dist/
```

Rollup bundles `src/assets/js/main.js` (and all imports) into a single ES module. CSS files are concatenated and minified via CleanCSS. HTML is minified. `data/`, `api/`, and `assets/media/` are copied as-is.

---

## How it works

### Boot sequence

`main.js` runs as a top-level `await` module. On load it:

1. Inlines all `.svg` `<img>` tags (so GSAP can animate paths)
2. Fetches `data/projects.json` in parallel
3. Renders the projects grid and initialises the filter
4. Runs the intro animation — or skips it if the session flag is set

### Morph pattern

Three panels share a common expand/collapse animation: the **contact form**, the **project filter**, and the **project detail** overlay. Each starts as a circular floating button and morphs into a centred panel via GSAP.

The shared logic lives in two files:

- `morph.js` — `openMorph` / `closeMorph`: GSAP animates position, size, and opacity from the trigger's bounding rect to a centred panel
- `float.js` — `createFloat`: wires up trigger click, close button, and backdrop click for the two floating-button panels (CTA and filter). Project detail is opened programmatically via `openDetail`.

### Project filter

Client-side, real-time. State is three `Set`s — `categories`, `tags`, `statuses`. Logic:

- **OR** within a group (selecting two tags shows projects matching either)
- **AND** between groups (tag + status selection must satisfy both)
- Empty group = no constraint

Visibility is toggled via CSS classes (`--filtered`, `--card-filtered`). A "Clear" button appears when any filter is active.

Filter logic is separated from the UI in `projects/filter-logic.js` (`filterProjects(projects, active) → Set<title>`).

### Internationalisation

The default language is English. For `/pt/`, two JSON files are fetched and merged:

- `data/lang/pt.projects.json` — overrides for project titles, descriptions, tag and category labels
- `data/lang/pt.ui.json` — UI strings (form labels, alerts, filter panel labels)

`lang.js` exposes a `t(key)` helper that returns the PT string or falls back to the key itself.

### Intro animation

On first visit (no session flag), the logo draws in via SVG path animation, then the `O` expands to fill the screen before collapsing into the header. On return visits or language switches, `skipIntro()` sets everything to its final state instantly.

---

## Structure

Source lives in `src/`. The build outputs to `dist/`.

CSS is modular — `main.css` is an `@import` chain. Design tokens are centralised in `base.css`; each concern (morph, float, form, badge, button, projects, filter, detail) has its own file.

JS follows the same pattern: `main.js` bootstraps everything; feature modules live alongside a subfolder for sub-modules (`anim/`, `projects/`). Shared primitives (`morph.js`, `float.js`, `utils.js`, `lang.js`) are imported where needed.

Content lives in `data/` — one JSON file drives the projects grid; a `lang/` subfolder holds PT override files for both project content and UI strings.

### Carousel component

A reusable vanilla JS + GSAP carousel in `src/assets/components/carousel/`. Import the JS module and link the CSS, then customise via CSS custom properties.

**Usage**

```js
import { createCarousel } from './src/assets/components/carousel/carousel.js';

const carousel = createCarousel(containerEl, {
  // identity / content
  items,            // Element[] | NodeList | number — omit for static HTML mode
  id,               // string — sets id on root element
  className,        // string — extra class(es) on root element
  // core behaviour
  type,             // 'slide' | 'cover' | 'fade'  (default: 'slide')
  duration,         // transition duration in seconds  (default: 0.4)
  // interaction
  arrows,           // boolean  (default: true)
  drag,             // boolean  (default: true)
  // playback
  loop,             // boolean  (default: false)
  autoplay,         // false | true (3 000 ms) | number in ms
  // indicators
  indicators,       // boolean  (default: false)
  indicatorsStyle,  // 'normal' | 'scroll'  (default: 'normal')
  indicatorsMax,    // max visible indicators in scroll style  (default: 7)
  thumbs,           // boolean — use thumbnail images as indicators  (default: false)
  // counter
  counter,          // boolean  (default: false)
  // multi-slide (slide type only)
  perView,          // visible slides at once, or 'auto'  (default: 1)
  perGroup,         // slides to advance per step  (default: 1)
  gap,              // px gap between slides  (default: 0)
  center,           // center active slide in viewport  (default: false)
  // initial state
  index,            // initial active slide index  (default: 0)
  // events
  on: {
    enter,          // (index, el) — fires on incoming slide
    leave,          // (index, el) — fires on outgoing slide
    change,         // (fromIndex, toIndex) — fires once per navigation
  },
});

// Public API
carousel.prev();
carousel.next();
carousel.goTo(index, animate);   // animate defaults to true
carousel.setItems(items, index); // replace slides at runtime
carousel.index();                // returns current index
```

**Thumb sources** (resolved in priority order per item): `node.thumb` property → `data-thumb` attribute → `src` if item is an `<img>`.

**CSS custom properties** (set on `.plura-carousel` or any ancestor):

| Property | Default | Description |
|---|---|---|
| `--plura-carousel-item-bg` | `#fff` | Slide background |
| `--plura-carousel-arrow-size` | `24px` | Arrow icon size |
| `--plura-carousel-indicator-size` | `8px` | Indicator diameter |
| `--plura-carousel-indicator-gap` | `6px` | Gap between indicators |
| `--plura-carousel-indicator-opacity` | `0.2` | Inactive indicator opacity |
| `--plura-carousel-indicators-margin` | `12px` | Space above indicator row |
| `--plura-carousel-thumb-width` | `40px` (mobile) / `52px` (desktop) | Thumb width |
| `--plura-carousel-thumb-height` | `28px` (mobile) / `36px` (desktop) | Thumb height |
| `--plura-carousel-thumb-radius` | `3px` | Thumb border radius |
| `--plura-carousel-transition` | `0.3s ease` | Shared transition timing |

A testbed lives in `test/carousel/`.

---

### Lightbox component

A fullscreen image viewer in `src/assets/components/lightbox/`. Wraps a carousel internally.

```js
import { createLightbox } from './src/assets/components/lightbox/lightbox.js';

const lb = createLightbox(items, initialIndex, {
  id,           // string — registry key for singleton reuse
  arrows,       // boolean  (default: false)
  counter,      // boolean  (default: false)
  indicators,   // boolean  (default: false)
  thumbs,       // boolean  (default: false)
  onClose,      // (finalIndex) — called on close
});

lb.open(index);
lb.close();
lb.goTo(index, animate);
lb.setItems(items, index);   // swap items; skips rebuild if same reference
```

Passing `id` opts into a singleton registry — subsequent `createLightbox` calls with the same `id` return the existing instance. Useful for sharing one lightbox across multiple galleries.

A testbed lives in `test/lightbox/`.

---

### Gallery component

Combines a carousel with a lightbox in `src/assets/components/gallery/`.

```js
import { createGallery } from './src/assets/components/gallery/gallery.js';

createGallery(containerEl, items, 'carousel', {
  carousel: { /* createCarousel options */ },
  lightbox: { /* createLightbox options, including id */ },
});
```

Clicking the active carousel item opens the lightbox at the current index.

---

## projects.json shape

```json
{
  "statuses":   { "dev": "In Development", "archived": "Archived" },
  "tags":       { "<key>": "<label>" },
  "categories": { "<key>": "<label>" },
  "projects": [
    {
      "title":       "",
      "url":         "",
      "summary":     "",
      "category":    "<key>",
      "tags":        ["<key>"],
      "status":      "<key>",
      "featured":    true
    }
  ]
}
```

`status` and `featured` are optional. PT overrides in `pt.projects.json` are merged by `title` — only the fields present in the override file are replaced.
