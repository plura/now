// ─── Projects carousel item ───────────────────────────────────

import { el } from '../utils.js';
import { buildProjectMeta } from '../projects.js';

export function createProjectsCarouselItem(project) {
  return el('div', { class: 'plura-projects-carousel-item plura-panel' },
    el('div', { class: 'plura-projects-carousel-item-header plura-panel-header' },
      el('span', { class: 'plura-projects-carousel-item-category', text: project.category.label }),
      el('h2',  { class: 'plura-projects-carousel-item-title plura-panel-title', text: project.title }),
      buildProjectMeta(project)
    ),
    project.summary && el('div', { class: 'plura-projects-carousel-item-body plura-panel-body' },
      el('p', { class: 'plura-projects-carousel-item-desc', text: project.summary })
    ),
    el('div', { class: 'plura-projects-carousel-item-gallery' })
  );
}
