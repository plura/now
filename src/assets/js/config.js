// ─── Runtime config ───────────────────────────────────────────
// Values derived from the page environment at load time.

// ISO 639-1 language code from <html lang="…">, e.g. "en", "pt"
export const lang = document.documentElement.lang.split('-')[0];

// Base path for asset/data resolution — set via <meta name="base-path"> so
// /pt/ and other sub-paths can resolve URLs relative to the site root.
export const basePath = document.querySelector('meta[name="base-path"]')?.content ?? '.';

// Projects content path — served from public/, outside the build pipeline.
// Override via <meta name="projects-path"> for prod.
export const projectsPath = document.querySelector('meta[name="projects-path"]')?.content ?? '/public/projects';

// Default language for fallback resolution.
export const DEFAULT_LANG = 'en';

// Ordered fallback chain: current lang first, default lang second (if different).
export const langs = lang !== DEFAULT_LANG ? [lang, DEFAULT_LANG] : [DEFAULT_LANG];
