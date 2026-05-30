// ─── Overlay ──────────────────────────────────────────────────

/**
 * @param {Element} root
 * @param {object}  options
 * @param {string}   [options.keepOpenSelector]  CSS selector — clicks inside won't dismiss.
 * @param {Function} [options.onBeforeOpen]      Runs synchronously before the open animation.
 * @param {Function} [options.onClose]           Fires immediately when close is triggered (capture state here).
 * @param {Function} [options.onAfterClose]      Runs after the close animation completes (DOM cleanup etc.).
 * @returns {{ open: Function, close: Function }}
 */
export function initOverlay(root, { keepOpenSelector, onBeforeOpen, onClose, onAfterClose } = {}) {
  root.classList.add('plura-overlay');
  gsap.set(root, { autoAlpha: 0 });
  root.setAttribute('tabindex', '-1');

  // Both Escape and backdrop click route through close() — overlay owns dismissal.
  root.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // elementFromPoint is used instead of e.target because carousel's drag handler
  // calls setPointerCapture, routing all pointer events to the items element.
  root.addEventListener('click', e => {
    const actual = document.elementFromPoint(e.clientX, e.clientY);
    if (!actual?.closest(keepOpenSelector)) close();
  });

  function open() {
    onBeforeOpen?.();
    gsap.set(root, { visibility: 'visible' });
    root.focus();
    gsap.to(root, { opacity: 1, duration: 0.25 });
  }

  function close() {
    onClose?.();
    gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete: onAfterClose });
  }

  return { open, close };
}
