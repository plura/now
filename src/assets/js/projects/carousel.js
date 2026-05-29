// ─── Projects carousel overlay ────────────────────────────────

import { createCarousel } from '../../components/carousel/carousel.js';
import { createProjectsCarouselItem } from './carousel-item.js';
import { initOverlay } from '../overlay.js';

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

  const { goTo } = createCarousel(overlay, {
    items:   flat.length,
    perView: 'auto',
    center:  true,
    gap:     100,
    on: { enter: onEnter },
  });

  // ── Overlay ──────────────────────────────────────────────────

  const { open: overlayOpen, close: overlayClose } = initOverlay(overlay, {
    keepOpenSelector: '.plura-carousel-item',
    onDismiss: close,
  });

  function open(index) {
    goTo(index, false);
    overlayOpen();
  }

  function close() {
    overlayClose();
  }

  return { open, close, goTo };
}

// ─── Helpers ──────────────────────────────────────────────────

function flattenProjects(categories, projects) {
  return Object.keys(categories).flatMap(catKey =>
    projects.filter(p => p.category.key === catKey)
  );
}
