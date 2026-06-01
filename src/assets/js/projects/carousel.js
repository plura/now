// ─── Projects carousel overlay ────────────────────────────────

import { createCarousel } from '../../components/carousel/carousel.js';
import { createCarouselItem } from './carousel-item.js';
import { initOverlay } from '../overlay.js';

const overlay = document.getElementById('plura-projects-carousel');

// ─── Init ─────────────────────────────────────────────────────

export function createCarousel(flat) {
  const populated = new Set();

  function onEnter(index, slide) {
    if (populated.has(index)) return;
    populated.add(index);
    slide.appendChild(createCarouselItem(flat[index]));
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

  let pendingIndex = 0;

  const { open: openOverlay, close } = initOverlay(overlay, {
    keepOpenSelector: '.plura-carousel-item, .plura-carousel-arrow',
    onBeforeOpen: () => goTo(pendingIndex, false),
  });

  function open(index) {
    pendingIndex = index;
    openOverlay();
  }

  return { open, close, goTo };
}

