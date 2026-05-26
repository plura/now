// carousel.js — requires window.gsap (CDN global)

import { el } from '../../js/utils.js';

/**
 * @param {Element} container  Host element. If it already has .plura-carousel it is used directly; otherwise a .plura-carousel is created inside it.
 * @param {object}  options
 * // identity / content
 * @param {Element[]|NodeList}     [options.items]              Content nodes to wrap. Omit for static HTML mode.
 * @param {string}                 [options.id]                 Sets id on the root element.
 * @param {string}                 [options.className]          Extra class(es) added to the root element.
 * // core behaviour
 * @param {'slide'|'cover'|'fade'} [options.type='slide']       Animation type.
 * @param {number}                 [options.duration=0.4]       Transition duration in seconds.
 * // interaction
 * @param {boolean}                [options.arrows=true]        Show prev/next arrow buttons.
 * @param {boolean}                [options.drag=true]          Enable pointer drag/swipe.
 * // playback
 * @param {boolean}                [options.loop=false]         Wrap around at first/last slide.
 * @param {boolean|number}         [options.autoplay=false]     true = 3000 ms, or pass ms directly.
 * // dots
 * @param {boolean}                [options.dots=false]         Show dot navigation.
 * @param {'normal'|'scroll'}      [options.dotsStyle='normal'] Dot style variant.
 * @param {number}                 [options.dotsMax=7]          Max visible dots in scroll style.
 * // counter
 * @param {boolean}                [options.counter=false]      Show slide counter (e.g. 2 / 5).
 * // multi-slide (slide type only)
 * @param {number}                 [options.perView=1]          Visible slides at once.
 * @param {number}                 [options.perGroup=1]         Slides to advance per step.
 * @param {number}                 [options.gap=0]              Gap in px between slides.
 * // positioning (slide type only)
 * @param {boolean}                [options.center=false]       Center active slide in viewport.
 * // initial state
 * @param {number}                 [options.index=0]            Initial active slide index.
 * // events
 * @param {object}                 [options.on={}]              Event callbacks.
 * @param {Function}               [options.on.enter]           Fires on incoming slide: (index, el).
 * @param {Function}               [options.on.leave]           Fires on outgoing slide: (index, el).
 * @param {Function}               [options.on.change]          Fires once per navigation: (fromIndex, toIndex).
 * @returns {{ root: Element, prev: Function, next: Function }}
 */
export function createCarousel(container, options = {}) {
  const {
    // identity / content
    items,
    id,
    className,
    // core behaviour
    type     = 'slide',
    duration = 0.4,
    // interaction
    arrows   = true,
    drag     = true,
    // playback
    loop     = false,
    autoplay = false,
    // dots
    dots      = false,
    dotsStyle = 'normal',
    dotsMax   = 7,
    // counter
    counter  = false,
    // multi-slide (slide type only)
    perView  = 1,
    perGroup = 1,
    gap      = 0,
    // positioning (slide type only)
    center   = false,
    // initial state
    index: initialIndex = 0,
    // events
    on = {},
  } = options;

  // If container already is .plura-carousel, use it directly.
  // Otherwise create .plura-carousel inside it.
  const root = container.classList.contains('plura-carousel')
    ? container
    : el('div', { class: 'plura-carousel' });

  if (root !== container) container.appendChild(root);

  if (id)        root.id = id;
  if (className) root.classList.add(...className.split(' '));
  root.classList.add(`plura-carousel--${type}`);

  // ── Items ──────────────────────────────────────────────────────

  const itemsCtrl = createItems(root, items, type, duration, perView, gap, center, initialIndex);
  const slideItems = itemsCtrl.items; // [{ el }, ...]

  // ── Nav elements ───────────────────────────────────────────────

  let arrowsCtrl, counterCtrl, dotsCtrl;

  if (dots) {
    dotsCtrl = createDots(slideItems.length, { dotsStyle, dotsMax }, i => goTo(i));
    root.appendChild(dotsCtrl.el);
  }

  // ── State ──────────────────────────────────────────────────────

  let index = -1;
  const total = slideItems.length;

  function normalizeIndex(value) {
    if (typeof value !== 'number') return 0;
    return Math.max(0, Math.min(value, total - 1));
  }

  function updateState() {
    itemsCtrl.update(index);
    if (arrowsCtrl)  arrowsCtrl.update(index, total);
    if (counterCtrl) counterCtrl.update(index, total);
    if (dotsCtrl)    dotsCtrl.update(index);
  }

  // ── Navigation ─────────────────────────────────────────────────

  function goTo(i) {
    if (index !== -1) on.leave?.(index, slideItems[index].el); // 1. outgoing slide (skipped on init)
    itemsCtrl.animate(index, i);                               // 2. animate
    on.change?.(index, i);                                     // 3. transition starts (fromIndex, toIndex)
    index = i;
    updateState();                                             // 4. active class, arrows, dots, counter
    on.enter?.(index, slideItems[index].el);                   // 5. incoming slide
  }

  const step = perView === 'auto' ? 1 : perGroup;

  function prev() { goTo(index > 0         ? Math.max(0,          index - step) : loop ? total - 1 : index); }
  function next() { goTo(index < total - 1 ? Math.min(total - 1,  index + step) : loop ? 0         : index); }

  if (arrows) {
    arrowsCtrl = createArrows(() => prev(), () => next(), loop);
    root.appendChild(arrowsCtrl.el);
  }

  if (counter) {
    counterCtrl = createCounter();
    root.appendChild(counterCtrl.el);
  }

  if (drag) {
    const dragOptions = { onPrev: prev, onNext: next };

    if (type === 'slide') {
      const strip = itemsCtrl.el;

      dragOptions.onMove   = delta => gsap.set(strip, { x: itemsCtrl.slideX(index) + delta });
      dragOptions.onCancel = ()    => gsap.to(strip,  { x: itemsCtrl.slideX(index), duration: 0.3, ease: 'power2.out' });
    }

    createDrag(itemsCtrl.el, dragOptions);
  }

  if (autoplay) {
    const autoplayCtrl = createAutoplay(next, typeof autoplay === 'number' ? autoplay : 3000);
    autoplayCtrl.start();
    root.addEventListener('pointerenter', autoplayCtrl.stop);
    root.addEventListener('pointerleave', autoplayCtrl.start);
  }

  if (typeof lucide !== 'undefined') lucide.createIcons({ el: root });

  // ── Activate ───────────────────────────────────────────────────
  // Single activation path — sets initial index, fires on.enter, syncs all UI elements.

  goTo(normalizeIndex(initialIndex));

  // ── Public API ─────────────────────────────────────────────────

  return { root, prev, next };
}

// ── Items ─────────────────────────────────────────────────────────

function createItem(node, { type, duration, active = false } = {}) {
  // Static mode: node is already a .plura-carousel-item — adopt it directly.
  // Dynamic mode: node is raw content — wrap it.
  const itemEl = node instanceof Node && node.classList.contains('plura-carousel-item')
    ? node
    : el('div', { class: 'plura-carousel-item' }, ...(node instanceof Node ? [node] : Array.from(node)));

  function animate(active, direction) {}

  // `active` sets the initial GSAP state — true for the first item, false for all others.
  if (type === 'cover') {
    gsap.set(itemEl, { x: '0%', autoAlpha: active ? 1 : 0, zIndex: active ? 1 : 0 });
    animate = (active, direction) => {
      if (active) {
        gsap.set(itemEl, { x: direction === 1 ? '100%' : '-100%', zIndex: 1, autoAlpha: 1 });
        // overwrite: 'auto' redirects any running tween on conflicting properties rather than killing it abruptly.
      gsap.to(itemEl,  { x: '0%', duration, ease: 'power2.inOut', overwrite: 'auto' });
      } else {
        gsap.set(itemEl, { zIndex: 0 });
      }
    };
  }

  if (type === 'fade') {
    gsap.set(itemEl, { autoAlpha: active ? 1 : 0, x: '0%' });
    animate = (active) => gsap.to(itemEl, { autoAlpha: active ? 1 : 0, duration, ease: 'power1.inOut', overwrite: 'auto' });
  }

  return {
    el: itemEl,
    animate,
    update(isActive) {
      itemEl.classList.toggle('plura-carousel-item--active', isActive);
      if (isActive) itemEl.classList.add('plura-carousel-item--visited');
    },
  };
}

function createItems(root, rawItems, type, duration, perView, gap, center, initialIndex = 0) {
  let wrapper, itemsEl;

  if (root.querySelector('.plura-carousel-wrapper')) {
    wrapper  = root.querySelector('.plura-carousel-wrapper');
    itemsEl  = wrapper.querySelector('.plura-carousel-items');
  } else {
    itemsEl = el('div', { class: 'plura-carousel-items' });
    wrapper  = el('div', { class: 'plura-carousel-wrapper' }, itemsEl);
    root.appendChild(wrapper);
  }

  let items;

  if (rawItems) {
    items = Array.from(rawItems).map((node, i) => {
      const item = createItem(node, { type, duration, active: i === initialIndex });
      itemsEl.appendChild(item.el);
      return item;
    });
  } else {
    items = Array.from(itemsEl.querySelectorAll('.plura-carousel-item')).map((itemEl, i) =>
      createItem(itemEl, { type, duration, active: i === initialIndex })
    );
  }

  if (type === 'slide') {
    if (perView === 'auto') {
      root.classList.add('plura-carousel--auto');
    } else {
      if (perView > 1) itemsEl.style.setProperty('--plura-carousel-per-view', perView);
    }
    if (gap > 0) itemsEl.style.setProperty('--plura-carousel-gap', `${gap}px`);
  }

  function slideX(index) {
    const x = -items[index].el.offsetLeft;
    if (!center) return x;
    return x + (wrapper.clientWidth - items[index].el.offsetWidth) / 2;
  }

  function animate(fromIndex, toIndex) {
    const direction = toIndex > fromIndex ? 1 : -1;

    if (type === 'slide') {
      gsap.to(itemsEl, { x: slideX(toIndex), duration, ease: 'power2.inOut', overwrite: 'auto' });
    } else {
      if (fromIndex !== -1) items[fromIndex].animate(false, direction);
      items[toIndex].animate(true, direction);
    }
  }

  function update(index) {
    items.forEach((item, i) => item.update(i === index));
  }

  if (type === 'slide') gsap.set(itemsEl, { x: slideX(initialIndex) });

  return { el: itemsEl, items, animate, update, slideX };
}

// ── Nav ──────────────────────────────────────────────────────────

function createArrows(onPrev, onNext, loop = false) {
  const btnPrev = el('button', { class: 'plura-carousel-arrow plura-carousel-arrow--prev', 'aria-label': 'Previous' },
    el('i', { 'data-lucide': 'chevron-left' })
  );
  const btnNext = el('button', { class: 'plura-carousel-arrow plura-carousel-arrow--next', 'aria-label': 'Next' },
    el('i', { 'data-lucide': 'chevron-right' })
  );

  btnPrev.addEventListener('click', onPrev);
  btnNext.addEventListener('click', onNext);

  return {
    el: el('div', { class: 'plura-carousel-arrows' }, btnPrev, btnNext),
    update(index, total) {
      btnPrev.disabled = !loop && index === 0;
      btnNext.disabled = !loop && index === total - 1;
    },
  };
}

function createDots(count, { dotsStyle = 'normal', dotsMax = 7 }, onSelect) {
  if (dotsStyle === 'normal') {
    const container = el('div', { class: 'plura-carousel-dots' });
    for (let i = 0; i < count; i++) {
      const dot = el('button', { class: 'plura-carousel-dot', 'aria-label': `Go to slide ${i + 1}` });
      dot.addEventListener('click', () => onSelect(i));
      container.appendChild(dot);
    }

    return {
      el: container,
      update(index) {
        Array.from(container.children).forEach((dot, i) => {
          dot.classList.toggle('is-active', i === index);
        });
      },
    };
  }

  if (dotsStyle === 'scroll') {
    const dotSize = 8;
    const dotGap  = 6;
    const unit    = dotSize + dotGap;
    const half    = Math.floor(dotsMax / 2);

    const strip = el('div', { class: 'plura-carousel-dots-strip' });
    strip.style.paddingLeft = strip.style.paddingRight = `${half * unit}px`;

    for (let i = 0; i < count; i++) {
      const dot = el('button', { class: 'plura-carousel-dot', 'aria-label': `Go to slide ${i + 1}` });
      dot.addEventListener('click', () => onSelect(i));
      strip.appendChild(dot);
    }

    const container = el('div', { class: 'plura-carousel-dots plura-carousel-dots--scroll' }, strip);
    container.style.setProperty('--dots-max',          dotsMax);
    container.style.setProperty('--plura-carousel-dot-size', `${dotSize}px`);
    container.style.setProperty('--plura-carousel-dot-gap',  `${dotGap}px`);

    return {
      el: container,
      update(index) {
        strip.style.transform = `translateX(${-index * unit}px)`;
        Array.from(strip.children).forEach((dot, i) => {
          const dist    = Math.abs(i - index);
          const scale   = dist === 0 ? 1 : dist === 1 ? 0.72 : dist === 2 ? 0.54 : 0.4;
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.7  : dist === 2 ? 0.45 : 0.2;
          dot.classList.toggle('is-active', i === index);
          dot.style.transform = `scale(${scale})`;
          dot.style.opacity   = String(opacity);
        });
      },
    };
  }
}

function createAutoplay(next, interval) {
  let timer = null;

  function start() {
    if (timer) return;
    timer = setInterval(next, interval);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  return { start, stop };
}

function createDrag(el, { onPrev, onNext, onMove, onCancel, threshold = 50 }) {
  let startX = 0;

  el.addEventListener('pointerdown', e => {
    startX = e.clientX;
    el.setPointerCapture(e.pointerId); // keeps pointermove/pointerup firing even if pointer leaves the element
    el.classList.add('plura-carousel--dragging');
  });

  el.addEventListener('pointermove', e => {
    if (!el.hasPointerCapture(e.pointerId)) return;
    onMove?.(e.clientX - startX);
  });

  el.addEventListener('pointerup', e => {
    el.classList.remove('plura-carousel--dragging');
    const delta = e.clientX - startX;
    if      (delta >  threshold) onPrev();
    else if (delta < -threshold) onNext();
    else                         onCancel?.();
  });
}

function createCounter() {
  const current = el('span', { class: 'plura-carousel-counter-current' });
  const total   = el('span', { class: 'plura-carousel-counter-total' });

  return {
    el: el('div', { class: 'plura-carousel-counter' }, current, total),
    update(index, tot) {
      current.textContent = index + 1;
      total.textContent   = tot;
    },
  };
}
