// ─── Data fetching ────────────────────────────────────────────
// Centralised fetch with in-memory cache.
// Storing Promises (not resolved values) means concurrent fetches for the same
// URL don't race — the second caller awaits the same Promise.

import { basePath, langs, projectsPath } from './config.js';

// Raw text cache — always stores text; callers parse as needed.
const cache = new Map();

// fetchCached — fetch a URL and cache the result.
// as: 'text' (default) returns raw string; 'json' parses and returns an object.
// Returns null on fetch failure or (for 'json') on parse failure.
export async function fetchCached(url, { as = 'text' } = {}) {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => r.ok ? r.text() : null).catch(() => null));
  }
  const text = await cache.get(url);
  if (!text) return null;
  if (as === 'json') {
    try { return JSON.parse(text); } catch { return null; }
  }
  return text;
}

// fetchContent — fetch a localised file, trying each lang in the fallback chain.
// path may contain a {lang} placeholder which is replaced per attempt.
// Pass base to override the default basePath root.
// Pass markdown: true to parse the result with marked.js.
export async function fetchContent(path, { markdown = false, base } = {}) {
  for (const l of langs) {
    const url = `${base ?? basePath}/${path.replace('{lang}', l)}`;
    const text = await fetchCached(url);
    if (text) return markdown ? marked.parse(text) : text;
  }
  return null;
}

// fetchDescription — fetch and parse a per-project markdown description.
// Looks for public/projects/{slug}/{lang}.md with lang fallback.
export function fetchDescription(slug) {
  return fetchContent('{lang}.md', { markdown: true, base: `${projectsPath}/${slug}` });
}
