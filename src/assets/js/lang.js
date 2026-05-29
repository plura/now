export const lang     = document.documentElement.lang.split('-')[0];
export const basePath = document.querySelector('meta[name="base-path"]')?.content ?? '.';

const _ui = lang !== 'en'
  ? await fetch(`${basePath}/data/lang/${lang}.ui.json`)
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}))
  : {};

export function t(key, vars = {}) {
  let str = _ui[key] ?? key;
  for (const [k, v] of Object.entries(vars))
    str = str.replaceAll(`{${k}}`, v);
  return str;
}

export async function fetchLang(base, name) {
  if (lang === 'en') return null;
  try {
    const r = await fetch(`${base}/data/lang/${lang}.${name}.json`);
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}
