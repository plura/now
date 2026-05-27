// ─── Projects carousel overlay ────────────────────────────────

import { createCarousel } from '../../components/carousel/carousel.js';
import { createProjectsCarouselItem } from './carousel-item.js';

const overlay = document.getElementById('plura-projects-carousel');

// ─── Init ─────────────────────────────────────────────────────

export function createProjectsCarousel({ categories, projects }) {
  const flat      = flattenProjects(categories, projects);
  const populated = new Set();

  function onEnter(index, slideEl) {
    if (populated.has(index)) return;
    populated.add(index);
    slideEl.appendChild(createProjectsCarouselItem(flat[index]));
  }

  createCarousel(overlay, {
    items:   flat.length,
    perView: 'auto',
    center:  true,
    gap:     100,
    on: { enter: onEnter },
  });
}

// ─── Helpers ──────────────────────────────────────────────────

function flattenProjects(categories, projects) {
  return Object.keys(categories).flatMap(catKey =>
    projects.filter(p => p.category.key === catKey)
  );
}
