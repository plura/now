export const lang     = document.documentElement.lang;
export const basePath = document.querySelector('meta[name="base-path"]')?.content ?? '.';
export const isPt     = lang.startsWith('pt');

// Only fetched on PT pages; EN strings live as fallbacks at each call site
const _ui = isPt
  ? await fetch(`${basePath}/data/lang/ui.json`).then(r => r.json())
  : {};

export function t(key, vars = {}) {
  let str = _ui[key] ?? key;
  for (const [k, v] of Object.entries(vars))
    str = str.replaceAll(`{${k}}`, v);
  return str;
}
