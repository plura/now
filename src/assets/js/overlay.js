// ─── Overlay ──────────────────────────────────────────────────
// Two modes:
//   'overlay'  (default) — GSAP autoAlpha shows/hides the whole root.
//   'backdrop'           — root stays visible (e.g. float trigger lives inside).
//                          CSS :has() handles visuals; JS adds Escape, click-outside, focus.

/**
 * @param {Element} root
 * @param {object}  options
 * @param {'overlay'|'backdrop'} [options.mode]  default: 'overlay'
 * @param {string|Element} [options.keepOpenSelector]  Clicks inside won't dismiss.
 * @param {Function} [options.onBeforeOpen]   Runs synchronously before open.
 * @param {Function} [options.onClose]        Fires immediately when close is triggered.
 * @param {Function} [options.onAfterClose]   Runs after close animation completes.
 * @returns {{ open: Function, close: Function }}
 */
export function initOverlay(root, { mode = 'overlay', keepOpenSelector, onBeforeOpen, onClose, onAfterClose } = {}) {
  const isBackdrop = mode === 'backdrop';

  root.classList.add('plura-overlay');
  if (isBackdrop) root.classList.add('plura-overlay--backdrop');
  root.setAttribute('tabindex', '-1');

  if (!isBackdrop) {
    gsap.set(root, { autoAlpha: 0 });
  }

  root.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // elementFromPoint instead of e.target — carousel drag uses setPointerCapture
  // which routes pointer events to the items element regardless of actual position.
  root.addEventListener('click', e => {
    const actual = document.elementFromPoint(e.clientX, e.clientY);
    const inside = typeof keepOpenSelector === 'string'
      ? actual?.closest(keepOpenSelector)
      : keepOpenSelector?.contains(actual);
    if (!inside) close();
  });

  function open() {
    onBeforeOpen?.();
    if (!isBackdrop) {
      gsap.set(root, { visibility: 'visible' });
      gsap.to(root, { opacity: 1, duration: 0.25 });
    }
    root.focus();
  }

  function close() {
    onClose?.();
    if (!isBackdrop) {
      gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete: onAfterClose });
    } else {
      onAfterClose?.();
    }
  }

  return { open, close };
}
