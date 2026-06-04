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

// fetchContent — fetch a localised file, trying each lang in the fallback chain.
// path may contain a {lang} placeholder which is replaced per attempt.
// Pass markdown: true to parse the result with marked.js.
export async function fetchContent(path, { markdown = false } = {}) {
  for (const l of langs) {
    const url = `${basePath}/${path.replace('{lang}', l)}`;
    const text = await fetchCached(url);
    if (text) return markdown ? marked.parse(text) : text;
  }
  return null;
}

// fetchDescription — fetch and parse a per-project markdown description.
export function fetchDescription(slug) {
  return fetchContent(`data/descriptions/{lang}/${slug}.md`, { markdown: true });
}
