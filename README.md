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

```
src/
  index.html              EN page
  pt/
    index.html            PT page
  data/
    projects.json         content: categories, tags, statuses, projects
    lang/
      pt.projects.json    PT project content overrides
      pt.ui.json          PT UI string overrides
  assets/
    css/
      main.css            @import entry point
      base.css            CSS variables and reset
      style.css           layout, header, global
      badge.css           shared badge base and variants
      btn.css             button base (outlined default), --minimal, --sm
      morph.css           shared morph overlay pattern
      float.css           shared floating panel pattern
      form.css            form fields and alert styles
      projects.css        project grid, cards, items, filtered state
      contacts-cta.css    contact form overlay specifics
      projects-filter.css filter panel specifics
      project-detail.css  project detail overlay specifics
    js/
      main.js             bootstrap: init modules, run animations
      lang.js             language detection, t(), base path
      session.js          intro-seen flag (sessionStorage)
      utils.js            el(), img2svg helpers
      dev.js              dev mode flag
      morph.js            openMorph / closeMorph (GSAP)
      float.js            createFloat factory
      anim.js             revealUI, skipIntro, runIntroAnimation
      anim/
        intro.js          logo intro sequence
        logo.js           header logo path animation
        logo-o.js         O expansion animation
      projects.js         fetch, normalise, render grid
      contacts-cta.js     contact form overlay and submission
      projects/
        detail.js         project detail overlay
        filter.js         filter panel UI and state
        filter-logic.js   pure filter function
    media/
      plura-logo-anim.svg animated logo SVG
      icons/              social SVG icons
  robots.txt
  sitemap.xml
api/
  lib/phpmailer/
```

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
