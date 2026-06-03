// ─── Projects carousel item ───────────────────────────────────

import { el } from '../utils.js';
import { buildMeta } from './meta.js';
import { basePath } from '../config.js';
import { createGallery } from '../../components/gallery/gallery.js';

export function createCarouselItem(project) {
  const item = el('div', { class: 'plura-projects-carousel-item plura-panel' },
    el('div', { class: 'plura-projects-carousel-item-header plura-panel-header' },
      el('h2',  { class: 'plura-projects-carousel-item-title plura-panel-title', text: project.title }),
      el('span', { class: 'plura-projects-carousel-item-category', text: project.category.label }),
      buildMeta(project)
    ),
    project.summary && el('div', { class: 'plura-projects-carousel-item-body plura-panel-body' },
      el('p', { class: 'plura-projects-carousel-item-desc', text: project.summary })
    )
  );

  if (project.media.length) {
    const mediaItems = project.media.map(m =>
      `${basePath}/assets/media/projects/${project.slug}/${m.file}`
    );
    const { root } = createGallery(document.createElement('div'), mediaItems, 'carousel', {
      carousel: { className: 'plura-projects-carousel-item-gallery' },
    });
    item.appendChild(root);
  }

  return item;
}
