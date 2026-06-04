// lightbox.js — requires window.gsap (CDN global)

import { el } from '../../js/utils.js';
import { createCarousel } from '../carousel/carousel.js';
import { initOverlay } from '../../js/layers/overlay.js';

const registry = new Map();

/**
 * @param {string[]|Element[]|NodeList} items           Image URLs or existing DOM nodes.
 * @param {number}                      [initialIndex=0] Initial image index.
 * @param {object}                      [options={}]
 * @param {string}    [options.id]              Registry id — reuses the same instance across calls; also sets root element id.
 * @param {string}    [options.className]       Extra class(es) added to the root element.
 * @param {Function}  [options.onClose]         Called with final index when lightbox closes.
 * @param {boolean}   [options.counter=false]   Show slide counter.
 * @param {boolean}   [options.arrows=false]    Show prev/next arrows.
 * @param {boolean}   [options.indicators=false] Show indicator dots.
 * @param {boolean}   [options.thumbs=false]    Use thumbnail indicators.
 * @returns {{ open: Function, close: Function, goTo: Function, setItems: Function }}
 */
export function createLightbox(items, initialIndex = 0, options = {}) {
  const { id, className, onClose, counter = false, arrows = false, indicators = false, thumbs = false } = options;

  // ── Singleton registry ─────────────────────────────────────────
  // If an id is given and an instance already exists, swap items and return it.

  if (id && registry.has(id)) {
    return registry.get(id);
  }

  // ── Items ──────────────────────────────────────────────────────

  function buildCarouselItems(raw) {
    return Array.from(raw).map(item =>
      item instanceof Node ? item.cloneNode(true) : item
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
  if (id)        root.id = id;
  if (className) root.classList.add(...className.split(' '));

  // ── Overlay ────────────────────────────────────────────────────

  let _pendingIndex = initialIndex;

  const { open: openOverlay, close } = initOverlay(root, {
    keepOpenSelector: '.plura-carousel-item :is(img, video), .plura-carousel-arrow, .plura-carousel-indicators',
    onBeforeOpen:  () => { document.body.appendChild(root); carouselGoTo(_pendingIndex, false); },
    onClose:       () => { onClose?.(currentIndex); },
    onAfterClose:  () => root.remove(),
  });

  function open(i = currentIndex) {
    _pendingIndex = i;
    openOverlay();
  }

  // ── Items API ──────────────────────────────────────────────────

  let lastItems = null;

  // Reference equality — avoids rebuilding the carousel when the same item set is
  // reused (singleton pattern). Note: in-place array mutations are not detected
  // (may need revisiting if in-place mutations are expected).
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
