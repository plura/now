// ─── Projects carousel overlay ────────────────────────────────

import { createCarousel } from '../../components/carousel/carousel.js';
import { createProjectsCarouselItem } from './carousel-item.js';
import { initOverlay } from '../overlay.js';

const overlay = document.getElementById('plura-projects-carousel');

// ─── Init ─────────────────────────────────────────────────────

export function createProjectsCarousel(flat) {
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
    keyboard: true,
    on: { enter: onEnter },
  });

  // ── Overlay ──────────────────────────────────────────────────

  let _pendingIndex = 0;

  const { open: openOverlay, close } = initOverlay(overlay, {
    keepOpenSelector: '.plura-carousel-item, .plura-carousel-arrow',
    onBeforeOpen: () => goTo(_pendingIndex, false),
  });

  function open(index) { 
    _pendingIndex = index;
    openOverlay();
  }

  return { open, close, goTo };
}

