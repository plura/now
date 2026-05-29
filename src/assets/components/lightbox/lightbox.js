// lightbox.js — requires window.gsap (CDN global)

import { el } from '../../js/utils.js';
import { createCarousel } from '../carousel/carousel.js';

const registry = new Map();

/**
 * @param {string[]|Element[]|NodeList} items           Image URLs or existing DOM nodes.
 * @param {number}                      [initialIndex=0] Initial image index.
 * @param {object}                      [options={}]
 * @param {string}    [options.id]              Registry id — reuses the same instance across calls.
 * @param {Function}  [options.onClose]         Called with final index when lightbox closes.
 * @param {boolean}   [options.counter=false]   Show slide counter.
 * @param {boolean}   [options.arrows=false]    Show prev/next arrows.
 * @param {boolean}   [options.indicators=false] Show indicator dots.
 * @param {boolean}   [options.thumbs=false]    Use thumbnail indicators.
 * @returns {{ open: Function, close: Function, goTo: Function, setItems: Function }}
 */
export function createLightbox(items, initialIndex = 0, options = {}) {
  const { id, onClose, counter = false, arrows = false, indicators = false, thumbs = false } = options;

  // ── Singleton registry ─────────────────────────────────────────
  // If an id is given and an instance already exists, swap items and return it.

  if (id && registry.has(id)) {
    return registry.get(id);
  }

  // ── Items ──────────────────────────────────────────────────────

  function buildCarouselItems(raw) {
    return Array.from(raw).map(item =>
      typeof item === 'string' ? el('img', { src: item, alt: '' }) : item.cloneNode(true)
    );
  }

  // ── Carousel ───────────────────────────────────────────────────
  // Use a detached container — we mount root directly to body on open.

  let currentIndex = initialIndex;

  const container = document.createElement('div');
  const { root, goTo: carouselGoTo, setItems: carouselSetItems } = createCarousel(container, {
    items: buildCarouselItems(items),
    type:       'fade',
    arrows,
    drag:       true,
    keyboard:   true,
    counter,
    indicators,
    thumbs,
    loop:       false,
    index:      initialIndex,
    on: {
      enter: i => { currentIndex = i; },
    },
  });

  root.classList.add('plura-lightbox');
  gsap.set(root, { autoAlpha: 0 });

  // ── Close on backdrop click ────────────────────────────────────
  // elementFromPoint is used instead of e.target because the carousel's drag
  // handler calls setPointerCapture on the items element, which routes all
  // pointer events (including the click) to it — so e.target is always
  // .plura-carousel-items regardless of what was actually clicked.

  root.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  root.addEventListener('click', e => {
    const actual = document.elementFromPoint(e.clientX, e.clientY);
    if (!actual?.closest('.plura-carousel-item :is(img, video), .plura-carousel-arrow, .plura-carousel-indicators')) close();
  });

  // ── Open / Close ───────────────────────────────────────────────

  function open(i = currentIndex) {
    carouselGoTo(i, false);
    document.body.appendChild(root);
    root.focus();
    gsap.to(root, { autoAlpha: 1, duration: 0.25 });
  }

  function close() {
    const finalIndex = currentIndex;
    gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete: () => root.remove() });
    onClose?.(finalIndex);
  }

  let lastItems = null;

  function setItems(raw, startIndex = 0) {
    if (raw === lastItems) {
      carouselGoTo(startIndex, false);
    } else {
      lastItems = raw;
      carouselSetItems(buildCarouselItems(raw), startIndex);
    }
  }

  // ── Public API ─────────────────────────────────────────────────

  const instance = { open, close, goTo: carouselGoTo, setItems };

  if (id) {
    root.dataset.lightboxId = id;
    registry.set(id, instance);
  }

  return instance;
}
