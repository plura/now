// ─── Projects carousel item ───────────────────────────────────

import { el } from '../utils.js';
import { buildMeta } from './meta.js';
import { basePath, lang } from '../config.js';
import { createGallery } from '../../components/gallery/gallery.js';

export function createCarouselItem(project) {
  const descSlot = el('div', { class: 'plura-projects-carousel-item-description' });

  // Body children built explicitly to avoid passing falsy values to el()
  const bodyChildren = [];
  if (project.summary) {
    bodyChildren.push(el('p', { class: 'plura-projects-carousel-item-summary', text: project.summary }));
  }
  bodyChildren.push(descSlot);
  if (project.url) {
    bodyChildren.push(
      el('a', {
        class:  'plura-projects-carousel-item-link plura-badge plura-badge--outline',
        href:   project.url,
        target: '_blank',
        rel:    'noopener noreferrer',
        text:   new URL(project.url).hostname.replace(/^www\./, ''),
      },
        el('i', { 'data-lucide': 'external-link' })
      )
    );
  }

  const body = el('div', { class: 'plura-projects-carousel-item-body plura-panel-body' });
  bodyChildren.forEach(c => body.appendChild(c));

  const item = el('div', { class: 'plura-projects-carousel-item plura-panel' },
    el('div', { class: 'plura-projects-carousel-item-header plura-panel-header' },
      el('h2',  { class: 'plura-projects-carousel-item-title plura-panel-title', text: project.title }),
      el('span', { class: 'plura-projects-carousel-item-category', text: project.category.label }),
      buildMeta(project)
    ),
    body
  );

  // Lazy-fetch extended description; try current lang first, fall back to EN
  fetchDescription(project.slug).then(html => {
    if (html) descSlot.innerHTML = html;
  });

  // Mount gallery if project has media
  if (project.media.length) {
    const mediaItems = project.media.map(m => ({
      src: `${basePath}/assets/media/projects/${project.slug}/${m.file}`,
      alt: m.alt ?? '',
    }));
    const { root } = createGallery(document.createElement('div'), mediaItems, 'carousel', {
      carousel: { className: 'plura-projects-carousel-item-gallery' },
    });
    item.appendChild(root);
  }

  return item;
}

// Fetches and parses a Markdown description for the given slug.
// Tries the current language first; falls back to EN if not found.
async function fetchDescription(slug) {
  const langs = lang !== 'en' ? [lang, 'en'] : ['en'];
  for (const l of langs) {
    try {
      const r = await fetch(`${basePath}/data/descriptions/${l}/${slug}.md`);
      if (r.ok) return marked.parse(await r.text());
    } catch {}
  }
  return null;
}
