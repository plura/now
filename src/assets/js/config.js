// ─── Runtime config ───────────────────────────────────────────
// Values derived from the page environment at load time.

// ISO 639-1 language code from <html lang="…">, e.g. "en", "pt"
export const lang = document.documentElement.lang.split('-')[0];

// Base path for asset/data resolution — set via <meta name="base-path"> so
// /pt/ and other sub-paths can resolve URLs relative to the site root.
export const basePath = document.querySelector('meta[name="base-path"]')?.content ?? '.';
