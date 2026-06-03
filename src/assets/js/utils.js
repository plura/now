// ─── DOM + asset helpers ───────────────────────────────────────

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class')        node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k === 'text')    node.textContent = v;
    else                      node.setAttribute(k, v);
  }
  children.filter(Boolean).forEach(c => node.appendChild(c));
  return node;
}

export function createLink(href, label, { className, icon, target = '_blank', rel = 'noopener noreferrer' } = {}) {
  const a = el('a', { ...(className && { class: className }), href, target, rel });
  if (label) a.appendChild(document.createTextNode(label));
  if (icon)  a.appendChild(el('i', { 'data-lucide': icon }));
  return a;
}

export async function img2svg(img) {
  if (!img.src.endsWith('.svg')) return;

  const res = await fetch(img.src);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) return;

  if (img.id) svg.id = img.id;
  img.classList.forEach(cls => svg.classList.add(cls));

  img.replaceWith(svg);
  return svg;
}

export async function imgs2svg() {
  const imgs = [...document.querySelectorAll('img[src$=".svg"]')];
  return Promise.all(imgs.map(img2svg));
}
