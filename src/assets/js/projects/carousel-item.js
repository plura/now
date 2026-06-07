// ─── Projects carousel item ───────────────────────────────────

import { el, createLink } from '../utils.js';
import { buildMeta } from './meta.js';
import { projectsPath } from '../config.js';
import { fetchDescription } from '../data.js';
import { createGallery } from '../../shared/components/gallery/gallery.js';

export function createCarouselItem(project) {

  // ── Header ────────────────────────────────────────────────────

  const header = el('div', { class: 'plura-projects-carousel-item-header plura-panel-header' },
    el('h2',  { class: 'plura-projects-carousel-item-title plura-panel-title', text: project.title }),
    el('span', { class: 'plura-projects-carousel-item-category', text: project.category.label }),
    buildMeta(project),
    project.url && createLink(project.url, new URL(project.url).hostname.replace(/^www\./, ''), {
      className: 'plura-projects-carousel-item-link plura-badge plura-badge--outline',
      icon:      'external-link',
    })
  );

  // ── Body ──────────────────────────────────────────────────────

  const descSlot = el('div', { class: 'plura-projects-carousel-item-description' });
  const body     = el('div', { class: 'plura-projects-carousel-item-body plura-panel-body' }, descSlot);

  // Try description first; fall back to summary if none found.
  fetchDescription(project.slug).then(html => {
    if (html) {
      descSlot.innerHTML = html;
    } else if (project.summary) {
      descSlot.appendChild(el('p', { class: 'plura-projects-carousel-item-summary', text: project.summary }));
    }
  });

  // ── Item ──────────────────────────────────────────────────────

  const item = el('div', { class: 'plura-projects-carousel-item plura-panel' }, header, body);

  // ── Gallery ───────────────────────────────────────────────────

  if (project.media.length) {
    const mediaItems = project.media.map(m => ({
      src: `${projectsPath}/${project.slug}/media/${m.file}`,
      alt: m.alt ?? '',
    }));
    const { root } = createGallery(document.createElement('div'), mediaItems, 'carousel', {
      carousel: { className: 'plura-projects-carousel-item-gallery' },
    });
    item.appendChild(root);
  }

  return item;
}
