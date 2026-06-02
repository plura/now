// ─── Projects carousel overlay ────────────────────────────────
// Fullscreen overlay carousel for browsing projects.
// Slides are empty shells — content is injected lazily via onEnter only when a slide becomes active.
// Exposes primitives (goTo, slideAt, reveal, currentIndex) so the orchestrator can drive
// the card↔slide transition; dismissal (Escape/click-outside) routes up via onDismiss.

// aliased to avoid collision with the exported createCarousel below
import { createCarousel as createBaseCarousel } from '../../components/carousel/carousel.js';
import { createCarouselItem } from './carousel-item.js';
import { initOverlay } from '../layers/overlay.js';

const overlay = document.getElementById('plura-projects-carousel');

// ─── Init ─────────────────────────────────────────────────────

export function createCarousel(initialFlat, { onDismiss } = {}) {
  let flat        = initialFlat;
  const populated = new Set();

  function onEnter(index, slide) {
    if (populated.has(index)) return;
    populated.add(index);
    slide.appendChild(createCarouselItem(flat[index]));
  }

  const base = createBaseCarousel(overlay, {
    items:    flat.length,
    perView:  'auto',
    center:   true,
    gap:      100,
    keyboard: true,
    on: { enter: onEnter },
  });

  const { open: reveal } = initOverlay(overlay, {
    keepOpenSelector: '.plura-carousel-item, .plura-carousel-arrow',
    onClose:          onDismiss,
  });

  function setItems(filtered) {
    flat = filtered;
    populated.clear();
    base.setItems(flat.length);
  }

  return {
    goTo:         base.goTo,
    slideAt:      base.itemAt,
    reveal,
    currentIndex: base.index,
    setItems,
  };
}
