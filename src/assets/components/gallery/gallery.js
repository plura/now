// gallery.js — requires window.gsap (CDN global)

import { el } from '../../js/utils.js';
import { createCarousel } from '../carousel/carousel.js';
import { createLightbox } from '../lightbox/lightbox.js';

/**
 * @param {Element}                     container          Host element.
 * @param {string[]|Element[]|NodeList} items              Image URLs or DOM nodes.
 * @param {'carousel'|'grid'}           [type='carousel']  Gallery layout type.
 * @param {object}  [options={}]
 * @param {string}  [options.id]           Sets id on the root element.
 * @param {string}  [options.className]    Extra class(es) added to the root element.
 * @param {object}  [options.carousel={}]  Options forwarded to createCarousel.
 * @param {object}  [options.lightbox={}]  Options forwarded to createLightbox.
 * @returns {{ root: Element }}
 */
export function createGallery(container, items, type = 'carousel', options = {}) {
  const { id, className, carousel: carouselOptions = {}, lightbox: lightboxOptions = {} } = options;

  // ── Normalise items ────────────────────────────────────────────

  items = Array.from(items).map(item =>
    typeof item === 'string' ? el('img', { src: item }) : item
  );

  // ── Layout ─────────────────────────────────────────────────────

  let root, carousel;

  if (type === 'carousel') {
    carousel = createCarousel(container, {
      thumbs: true,
      ...carouselOptions,
      items,
    });
    ({ root } = carousel);
    root.classList.add('plura-gallery');
    if (id)        root.id = id;
    if (className) root.classList.add(...className.split(' '));
  } else {
    throw new Error(`Gallery type '${type}' is not yet implemented.`);
  }

  // ── Lightbox ───────────────────────────────────────────────────

  const lb = createLightbox(items, 0, { thumbs: true, ...lightboxOptions });

  // ── Wire click → lightbox ──────────────────────────────────────

  // elementFromPoint bypasses setPointerCapture routing in carousel drag (same fix as lightbox)
  root.addEventListener('click', e => {
    const actual = document.elementFromPoint(e.clientX, e.clientY);
    if (!actual?.closest('.plura-carousel-item--active')) return;
    lb.open(carousel.index());
  });

  // ── Public API ─────────────────────────────────────────────────

  return { root };
}
