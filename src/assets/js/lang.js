import { lang, basePath } from './config.js';

// UI strings for non-EN locales. Fetched at module load (top-level await) so t() is
// synchronous everywhere. Degrades to {} on fetch/parse failure — missing keys fall
// back to the key string itself, so the page never breaks on a bad or missing file.
const _ui = lang !== 'en'
  ? await fetch(`${basePath}/data/lang/${lang}.ui.json`)
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}))
  : {};

// t(key) — translate a UI string. Falls back to the key itself so untranslated strings
// are visible but never throw. Supports {placeholder} interpolation via vars.
export function t(key, vars = {}) {
  let str = _ui[key] ?? key;
  for (const [k, v] of Object.entries(vars))
    str = str.replaceAll(`{${k}}`, v);
  return str;
}

const DEFAULT_LANG = 'en';

// langs — ordered fallback chain: current lang first, default lang second (if different).
export const langs = lang !== DEFAULT_LANG ? [lang, DEFAULT_LANG] : [DEFAULT_LANG];

// fetchLang — fetch a per-feature lang file (e.g. pt.projects.json).
// Returns null for EN or on failure; callers merge the result into their data.
export async function fetchLang(name) {
  if (lang === 'en') return null;
  try {
    const r = await fetch(`${basePath}/data/lang/${lang}.${name}.json`);
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}
