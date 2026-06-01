// ─── Projects carousel item ───────────────────────────────────

import { el } from '../utils.js';
import { buildProjectMeta } from './meta.js';

export function createProjectsCarouselItem(project) {
  return el('div', { class: 'plura-projects-carousel-item plura-panel' },
    el('div', { class: 'plura-projects-carousel-item-header plura-panel-header' },
      el('h2',  { class: 'plura-projects-carousel-item-title plura-panel-title', text: project.title }),
      el('span', { class: 'plura-projects-carousel-item-category', text: project.category.label }),
      buildProjectMeta(project)
    ),
    project.summary && el('div', { class: 'plura-projects-carousel-item-body plura-panel-body' },
      el('p', { class: 'plura-projects-carousel-item-desc', text: project.summary })
    ),
    el('div', { class: 'plura-projects-carousel-item-gallery' })
  );
}
