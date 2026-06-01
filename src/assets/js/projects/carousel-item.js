// ─── Projects carousel item ───────────────────────────────────

import { el } from '../utils.js';
import { buildMeta } from './meta.js';

export function createCarouselItem(project) {
  return el('div', { class: 'plura-projects-carousel-item plura-panel' },
    el('div', { class: 'plura-projects-carousel-item-header plura-panel-header' },
      el('h2',  { class: 'plura-projects-carousel-item-title plura-panel-title', text: project.title }),
      el('span', { class: 'plura-projects-carousel-item-category', text: project.category.label }),
      buildMeta(project)
    ),
    project.summary && el('div', { class: 'plura-projects-carousel-item-body plura-panel-body' },
      el('p', { class: 'plura-projects-carousel-item-desc', text: project.summary })
    ),
    el('div', { class: 'plura-projects-carousel-item-gallery' })
  );
}
