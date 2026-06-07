// ─── Runtime config ───────────────────────────────────────────
// Values derived from the page environment at load time.

// ISO 639-1 language code from <html lang="…">, e.g. "en", "pt"
export const lang = document.documentElement.lang.split('-')[0];

// Base path for asset/data resolution — set via <meta name="base-path"> so
// /pt/ and other sub-paths can resolve URLs relative to the site root.
export const basePath = document.querySelector('meta[name="base-path"]')?.content ?? '.';

// Media path for content assets (project images, etc.) — served from public/,
// outside the build pipeline. Override via <meta name="media-path"> for prod.
export const mediaPath = document.querySelector('meta[name="media-path"]')?.content ?? '/public/media';

// Default language for fallback resolution.
export const DEFAULT_LANG = 'en';

// Ordered fallback chain: current lang first, default lang second (if different).
export const langs = lang !== DEFAULT_LANG ? [lang, DEFAULT_LANG] : [DEFAULT_LANG];
