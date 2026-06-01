// ─── Projects carousel overlay ────────────────────────────────
// Fullscreen overlay carousel for browsing projects.
// Slides are empty shells — content is injected lazily via onEnter only when a slide becomes active.

// aliased to avoid collision with the exported createCarousel below
import { createCarousel as createBaseCarousel } from '../../components/carousel/carousel.js';
import { createCarouselItem } from './carousel-item.js';
import { initOverlay } from '../overlay.js';

const overlay = document.getElementById('plura-projects-carousel');

// ─── Init ─────────────────────────────────────────────────────

export function createCarousel(initialFlat) {
  let flat      = initialFlat;
  const populated = new Set();

  function onEnter(index, slide) {
    if (populated.has(index)) return;
    populated.add(index);
    slide.appendChild(createCarouselItem(flat[index]));
  }

  const { goTo, setItems: baseSetItems } = createBaseCarousel(overlay, {
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

  function setItems(filtered) {
    flat = filtered;
    populated.clear();
    baseSetItems(flat.length);
  }

  return { open, close, goTo, setItems };
}

