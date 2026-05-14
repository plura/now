export async function img2svg(img) {
  if (!img.src.endsWith('.svg')) return;

  const res = await fetch(img.src);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) return;

  img.replaceWith(svg);
  return svg;
}

export async function imgs2svg() {
  const imgs = [...document.querySelectorAll('img[src$=".svg"]')];
  return Promise.all(imgs.map(img2svg));
}
