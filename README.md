# now.plura.pt

A static portfolio placeholder, live while the main Plura site is in development.

No framework, no build step — plain HTML, CSS, and vanilla JS. Projects are driven by a single `projects.json` file, grouped by category and tagged, rendered into a grid on page load.

## Design intent

Minimal and light. Mostly text, generous whitespace, a strict grid. The logo animates in on load; everything else stays quiet. The goal is a page that feels considered without trying too hard — a holding page that doesn't look like one.

## Stack

- `index.html` — single page
- `style.css` — all styles
- `main.js` — fetches and renders `projects.json` (ES module)
- `projects.json` — content source: tags, categories, projects
- GSAP — logo animation
- Lucide — icons
