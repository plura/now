# now.plura.pt

A static portfolio placeholder, live while the main Plura site is in development.

No framework, no build step — plain HTML, CSS, and vanilla JS. Projects are driven by a single `data/projects.json` file, grouped by category and tagged, rendered into a grid on page load.

## Design intent

Minimal and light. Mostly text, generous whitespace, a strict grid. The logo animates in on load; the intro is skipped on return visits and language switches. Everything else stays quiet. The goal is a page that feels considered without trying too hard — a holding page that doesn't look like one.

## Stack

- **GSAP** — logo intro and UI animations
- **Lucide** — icons (CDN)
- **PHPMailer** — contact form backend (`api/`)

### Structure

```
index.html              EN page
pt/
  index.html            PT page
data/
  projects.json         content source: tags, categories, statuses, projects
  lang/
    pt.projects.json    PT project overrides
    pt.ui.json          PT UI strings
assets/
  css/
    base.css            reset and CSS variables
    style.css           layout, header, global
    projects.css        project grid and cards
    morph.css           shared morph overlay pattern
    cta.css             contact form overlay
  js/
    main.js             bootstrap: init modules, run animations
    anim.js             animation orchestrator: revealUI, skipIntro, runIntroAnimation
    anim/
      intro.js          logo intro sequence and finishIntro
      logo.js           logo path animation
      logo-o.js         O expansion animation (pure, no side effects)
    projects.js         fetch, normalise, and render projects grid
    project-detail.js   project expand overlay
    morph.js            shared morph overlay behaviour
    cta.js              contact form overlay
    lang.js             language helpers and base path
    session.js          intro-seen state (sessionStorage)
    utils.js            shared helpers
    dev.js              dev/debug flag
  media/
    plura-logo.svg      logo SVG (inlined at runtime by imgs2svg)
    icons/              SVG icons (social)
api/
  lib/phpmailer/        PHPMailer library
```

### projects.json shape

```json
{
  "statuses": { "dev": "In Development", "archived": "Archived", "soon": "Coming Soon" },
  "tags":     { "<key>": "<label>", … },
  "categories": { "<key>": "<label>", … },
  "projects": [
    {
      "title": "",
      "url": "",
      "description": "",
      "category": "<key>",
      "tags": ["<key>"],
      "status": "<key>"   // optional
    }
  ]
}
```
