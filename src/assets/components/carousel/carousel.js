// carousel.js — requires window.gsap (CDN global)

import { el } from '../../js/utils.js';

/**
 * @param {Element} container  Host element. If it already has .plura-carousel it is used directly; otherwise a .plura-carousel is created inside it.
 * @param {object}  options
 * // identity / content
 * @param {Element[]|NodeList|number} [options.items]           Content nodes to wrap, or a count to create empty slides. Omit for static HTML mode.
 * @param {string}                 [options.id]                 Sets id on the root element.
 * @param {string}                 [options.className]          Extra class(es) added to the root element.
 * // core behaviour
 * @param {'slide'|'cover'|'fade'} [options.type='slide']       Animation type.
 * @param {number}                 [options.duration=0.4]       Transition duration in seconds.
 * // interaction
 * @param {boolean}                [options.arrows=true]        Show prev/next arrow buttons.
 * @param {boolean}                [options.drag=true]          Enable pointer drag/swipe.
 * @param {boolean}                [options.keyboard=false]     Enable arrow key navigation when focused.
 * // playback
 * @param {boolean}                [options.loop=false]         Wrap around at first/last slide.
 * @param {boolean|number}         [options.autoplay=false]     true = 3000 ms, or pass ms directly.
 * // dots
 * @param {boolean}                [options.indicators=false]         Show indicator navigation.
 * @param {'normal'|'scroll'}      [options.indicatorsStyle='normal'] Indicator style variant.
 * @param {number}                 [options.indicatorsMax=7]          Max visible indicators in scroll style.
 * @param {boolean}                [options.thumbs=false]             Use thumbnail images as indicators (overrides normal/scroll style).
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
 * @returns {{ root: Element, prev: Function, next: Function, goTo: Function, setItems: Function, index: Function, itemAt: Function }}
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
		keyboard = false,
		// playback
		loop     = false,
		autoplay = false,
		// indicators
		indicators      = false,
		indicatorsStyle = 'normal',
		indicatorsMax   = 7,
		thumbs          = false,
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

	// ── Nav elements ───────────────────────────────────────────────

	let arrowsCtrl, counterCtrl, indicatorsCtrl;

	// ── State ──────────────────────────────────────────────────────

	let index, total;

	function initVars() {
		total = itemsCtrl.items().length;
		index = -1;
	}

	function normalizeIndex(value) {
		if (typeof value !== 'number') return 0;
		return Math.max(0, Math.min(value, total - 1));
	}

	function updateState() {
		itemsCtrl.update(index);
		if (arrowsCtrl)      arrowsCtrl.update(index, total);
		if (counterCtrl)     counterCtrl.update(index, total);
		if (indicatorsCtrl)  indicatorsCtrl.update(index);
	}

	initVars();

	// ── Navigation ─────────────────────────────────────────────────

	function goTo(i, animate = true) {
		i = normalizeIndex(i);
		if (index !== -1) on.leave?.(index, itemsCtrl.itemAt(index)); // 1. outgoing slide (skipped on init)
		itemsCtrl.animate(index, i, animate);                      // 2. animate (or instant set)
		on.change?.(index, i);                                     // 3. transition starts (fromIndex, toIndex)
		index = i;
		updateState();                                             // 4. active class, arrows, dots, counter
		on.enter?.(index, itemsCtrl.itemAt(index));                   // 5. incoming slide
	}

	const step = perView === 'auto' ? 1 : perGroup;

	function prev() { goTo(index > 0         ? Math.max(0,          index - step) : loop ? total - 1 : index); }
	function next() { goTo(index < total - 1 ? Math.min(total - 1,  index + step) : loop ? 0         : index); }

	function initIndicators() {
		const thumbSrcs = thumbs ? itemsCtrl.items().map(item => item.thumb) : null;
		indicatorsCtrl = createIndicators(total, { indicatorsStyle, indicatorsMax, thumbs, thumbSrcs }, i => goTo(i));
		root.appendChild(indicatorsCtrl.el);
	}

	if ((indicators || thumbs) && total > 1) initIndicators();

	if (arrows && total > 1) {
		arrowsCtrl = createArrows(() => prev(), () => next(), loop);
		root.appendChild(arrowsCtrl.el);
	}

	if (counter && total > 1) {
		counterCtrl = createCounter();
		root.appendChild(counterCtrl.el);
	}

	if (drag && total > 1) {
		const dragOptions = { onPrev: prev, onNext: next };

		if (type === 'slide') {
			const strip = itemsCtrl.el;

			dragOptions.onMove   = delta => gsap.set(strip, { x: itemsCtrl.slideX(index) + delta });
			dragOptions.onCancel = ()    => gsap.to(strip,  { x: itemsCtrl.slideX(index), duration: 0.3, ease: 'power2.out' });
		}

		createDrag(itemsCtrl.el, dragOptions);
	}

	if (keyboard) createKeyboard(root, { onPrev: prev, onNext: next });

	if (autoplay && total > 1) {
		const autoplayCtrl = createAutoplay(next, typeof autoplay === 'number' ? autoplay : 3000);
		autoplayCtrl.start();
		root.addEventListener('pointerenter', autoplayCtrl.stop);
		root.addEventListener('pointerleave', autoplayCtrl.start);
	}

	if (typeof lucide !== 'undefined') lucide.createIcons({ el: root });

	// ── setItems ───────────────────────────────────────────────────

	function setItems(newItems, startIndex = 0) {
		itemsCtrl.refresh(newItems);
		initVars();

		if (indicatorsCtrl) {
			indicatorsCtrl.el.remove();
			if ((indicators || thumbs) && total > 1) initIndicators();
		}

		goTo(startIndex);
	}

	// ── Activate ───────────────────────────────────────────────────
	// Single activation path — sets initial index, fires on.enter, syncs all UI elements.

	goTo(initialIndex);

	// ── Public API ─────────────────────────────────────────────────

	return { root, prev, next, goTo, setItems, index: () => index, itemAt: itemsCtrl.itemAt };
}

// ── Items ─────────────────────────────────────────────────────────

function resolveItem(item) {
	if (item instanceof Node) return item;
	const src   = typeof item === 'string' ? item : item?.src;
	const alt   = item?.alt   ?? '';
	const thumb = item?.thumb ?? null;
	if (!src) return item;
	const mimes  = { mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', mov: 'video/quicktime' };
	const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
	let node;
	if (isVideo) {
		const ext = src.split('?')[0].split('.').pop().toLowerCase();
		node = el('video', { muted: true, playsinline: true });
		node.appendChild(el('source', { src, type: mimes[ext] ?? 'video/mp4' }));
	} else {
		node = el('img', { src, alt });
	}
	if (thumb) node.thumb = thumb;
	return node;
}

function createItem(node, { type, duration, active = false } = {}) {
	// Static mode: node is already a .plura-carousel-item — adopt it directly.
	// Dynamic mode: node is raw content — wrap it.
	const itemEl = node instanceof Node && node.classList.contains('plura-carousel-item')
		? node
		: el('div', { class: 'plura-carousel-item' }, ...(node instanceof Node ? [node] : Array.from(node)));

	// static mode: data-thumb attribute; dynamic mode: thumb property on the node; img: src; video: poster only
	const thumb = node.thumb ?? itemEl.dataset.thumb
		?? (node instanceof HTMLImageElement ? node.src        : null)
		?? (node instanceof HTMLVideoElement ? node.poster || null : null);

	function animate(active, direction) {}

	// `active` sets the initial GSAP state — true for the first item, false for all others.
	if (type === 'cover') {
		gsap.set(itemEl, { x: '0%', autoAlpha: active ? 1 : 0, zIndex: active ? 1 : 0 });
		animate = (active, direction, animated = true) => {
			if (active) {
				if (animated) {
					gsap.set(itemEl, { x: direction === 1 ? '100%' : '-100%', zIndex: 1, autoAlpha: 1 });
					// overwrite: 'auto' redirects any running tween on conflicting properties rather than killing it abruptly.
					gsap.to(itemEl,  { x: '0%', duration, ease: 'power2.inOut', overwrite: 'auto' });
				} else {
					gsap.set(itemEl, { x: '0%', zIndex: 1, autoAlpha: 1 });
				}
			} else {
				gsap.set(itemEl, { zIndex: 0 });
			}
		};
	}

	if (type === 'fade') {
		gsap.set(itemEl, { autoAlpha: active ? 1 : 0, x: '0%' });
		animate = (active, direction, animated = true) => {
			if (animated) gsap.to(itemEl,  { autoAlpha: active ? 1 : 0, duration, ease: 'power1.inOut', overwrite: 'auto' });
			else          gsap.set(itemEl, { autoAlpha: active ? 1 : 0 });
		};
	}

	return {
		el: itemEl,
		thumb,
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

	if (type === 'slide') {
		if (perView === 'auto') root.classList.add('plura-carousel--auto');
		else if (perView > 1)   itemsEl.style.setProperty('--plura-carousel-per-view', perView);
		if (gap > 0)            itemsEl.style.setProperty('--plura-carousel-gap', `${gap}px`);
	}

	let items;

	function buildItems(raw) {
		itemsEl.innerHTML = '';
		if (typeof raw === 'number') raw = Array.from({ length: raw }, () => el('div'));
		raw = Array.from(raw ?? itemsEl.querySelectorAll('.plura-carousel-item')).map(resolveItem);
		return raw.map((node, i) => {
			const item = createItem(node, { type, duration, active: i === 0 });
			itemsEl.appendChild(item.el);
			return item;
		});
	}



	function slideX(index) {
		const x = -items[index].el.offsetLeft;
		if (!center) return x;
		return x + (wrapper.clientWidth - items[index].el.offsetWidth) / 2;
	}

	function refresh(raw) {
		items = buildItems(raw);
		if (type === 'slide') gsap.set(itemsEl, { x: slideX(0) });
	}

	function animate(fromIndex, toIndex, animated = true) {
		const direction = toIndex > fromIndex ? 1 : -1;

		if (type === 'slide') {
			if (animated) gsap.to(itemsEl,  { x: slideX(toIndex), duration, ease: 'power2.inOut', overwrite: 'auto' });
			else          { gsap.killTweensOf(itemsEl, 'x'); gsap.set(itemsEl, { x: slideX(toIndex) }); }
		} else {
			if (fromIndex !== -1) items[fromIndex].animate(false, direction, animated);
			items[toIndex].animate(true, direction, animated);
		}
	}

	function update(index) {
		items.forEach((item, i) => item.update(i === index));
	}

	refresh(rawItems);

	return { el: itemsEl, items: () => items, animate, update, slideX, refresh, itemAt: i => items[i].el };
}

// ── Nav ──────────────────────────────────────────────────────────

function createArrows(onPrev, onNext, loop = false) {
	const btnPrev = el('button', { class: 'plura-carousel-arrow plura-carousel-arrow--prev', 'aria-label': 'Previous' });
	const btnNext = el('button', { class: 'plura-carousel-arrow plura-carousel-arrow--next', 'aria-label': 'Next' });

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

function createIndicators(count, { indicatorsStyle = 'normal', indicatorsMax = 7, thumbs = false, thumbSrcs = null }, onSelect) {
	const isScroll = !thumbs && indicatorsStyle === 'scroll';

	const cls = ['plura-carousel-indicators', thumbs && 'plura-carousel-indicators--thumbs', isScroll && 'plura-carousel-indicators--scroll'].filter(Boolean).join(' ');
	const container = el('div', { class: cls });
	let target = container; // buttons are appended to strip in scroll mode, container otherwise

	let unit;
	if (isScroll) {
		const indicatorSize = 8, indicatorGap = 6;
		unit = indicatorSize + indicatorGap;
		const half  = Math.floor(indicatorsMax / 2);
		const strip = el('div', { class: 'plura-carousel-indicators-strip' });
		strip.style.paddingLeft = strip.style.paddingRight = `${half * unit}px`;
		container.style.setProperty('--indicators-max',                    indicatorsMax);
		container.style.setProperty('--plura-carousel-indicator-size', `${indicatorSize}px`);
		container.style.setProperty('--plura-carousel-indicator-gap',  `${indicatorGap}px`);
		container.appendChild(strip);
		target = strip;
	}

	for (let i = 0; i < count; i++) {
		const inner = thumbs && thumbSrcs?.[i] ? el('img', { src: thumbSrcs[i], alt: `Slide ${i + 1}` }) : null;
		const btn   = el('button', { class: 'plura-carousel-indicator', 'aria-label': `Go to slide ${i + 1}` }, ...(inner ? [inner] : []));
		btn.addEventListener('click', () => onSelect(i));
		target.appendChild(btn);
	}

	return {
		el: container,
		update(index) {
			Array.from(target.children).forEach((btn, i) => {
				btn.classList.toggle('is-active', i === index);
				if (isScroll) {
					const dist    = Math.abs(i - index);
					const scale   = dist === 0 ? 1 : dist === 1 ? 0.72 : dist === 2 ? 0.54 : 0.4;
					const opacity = dist === 0 ? 1 : dist === 1 ? 0.7  : dist === 2 ? 0.45 : 0.2;
					btn.style.transform = `scale(${scale})`;
					btn.style.opacity   = String(opacity);
				}
			});
			if (isScroll) target.style.transform = `translateX(${-index * unit}px)`;
		},
	};
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
	let hadMultiTouch = false; // true if a second finger was seen during this gesture

	el.addEventListener('pointerdown', e => {
		// isPrimary is true for the first finger only — ignore subsequent fingers but flag the gesture
		if (!e.isPrimary) { hadMultiTouch = true; return; }
		hadMultiTouch = false;
		startX = e.clientX;
		// setPointerCapture routes all future pointer events for this pointerId to this element,
		// even if the pointer moves outside it — ensures pointermove/pointerup are never lost
		el.setPointerCapture(e.pointerId);
		el.classList.add('plura-carousel--dragging');
	});

	el.addEventListener('pointermove', e => {
		// hasPointerCapture guards against moves from uncaptured pointers (e.g. second finger)
		if (!el.hasPointerCapture(e.pointerId)) return;
		onMove?.(e.clientX - startX);
	});

	el.addEventListener('pointerup', e => {
		if (!e.isPrimary) return; // ignore second-finger releases
		el.classList.remove('plura-carousel--dragging');
		// if a second finger appeared during the gesture, cancel instead of navigating
		if (hadMultiTouch) { onCancel?.(); return; }
		const delta = e.clientX - startX;
		if      (delta >  threshold) onPrev();
		else if (delta < -threshold) onNext();
		else                         onCancel?.();
	});
}

function createKeyboard(root, { onPrev, onNext }) {
	root.tabIndex = 0;
	root.addEventListener('keydown', e => {
		if (e.key === 'ArrowLeft')  onPrev();
		if (e.key === 'ArrowRight') onNext();
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
