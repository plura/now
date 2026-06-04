// ─── Data fetching ────────────────────────────────────────────
// Centralised fetch with in-memory cache.
// Storing Promises (not resolved values) means concurrent fetches for the same
// URL don't race — the second caller awaits the same Promise.

import { basePath } from './config.js';
import { langs } from './lang.js';

const cache = new Map();

// fetchCached — fetch a URL, cache and return the text, or null on failure.
export function fetchCached(url) {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => r.ok ? r.text() : null).catch(() => null));
  }
  return cache.get(url);
}

// fetchDescription — fetch and parse a per-project markdown description.
// Tries the current language first, falls back to EN.
// Returns parsed HTML string, or null if no file exists.
export async function fetchDescription(slug) {
  for (const l of langs) {
    const text = await fetchCached(`${basePath}/data/descriptions/${l}/${slug}.md`);
    if (text) return marked.parse(text);
  }
  return null;
}
