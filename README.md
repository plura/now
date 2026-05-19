# now.plura.pt

A static portfolio placeholder, live while the main Plura site is in development.

No framework, no build step — plain HTML, CSS, and vanilla JS. Projects are driven by a single `projects.json` file, grouped by category and tagged, rendered into a grid on page load.

## Design intent

Minimal and light. Mostly text, generous whitespace, a strict grid. The logo animates in on load; everything else stays quiet. The goal is a page that feels considered without trying too hard — a holding page that doesn't look like one.

## Stack

- **GSAP** — logo intro and UI animations
- **Lucide** — icons (CDN)
- **PHPMailer** — contact form backend (`api/`)

### Structure

```
index.html              single page
projects.json           content source: tags, categories, statuses, projects
assets/
  css/
    base.css            reset and CSS variables
    style.css           layout, header, global
    projects.css        project grid and cards
    morph.css           shared morph overlay pattern
    cta.css             contact form overlay
  js/
    main.js             bootstrap: init modules, run animations
    anim.js             animation orchestrator
    anim/
      intro.js          logo intro sequence
      logo.js           logo path animation
      logo-o.js         O expansion element
    projects.js         fetch, normalise, and render projects grid
    project-detail.js   project expand overlay
    morph.js            shared morph overlay behaviour
    cta.js              contact form overlay
    utils.js            shared helpers
    dev.js              dev/debug flag
  media/
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
