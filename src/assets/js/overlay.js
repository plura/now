// ─── Overlay ──────────────────────────────────────────────────

/**
 * @param {Element} root
 * @param {object}  options
 * @param {string}  options.keepOpenSelector  CSS selector — clicks inside won't dismiss.
 * @param {Function} [options.onDismiss]      Called when the user triggers a close.
 * @returns {{ open: Function, close: Function }}
 */
export function initOverlay(root, { keepOpenSelector, onDismiss } = {}) {
  root.classList.add('plura-overlay');
  gsap.set(root, { autoAlpha: 0 });

  root.addEventListener('keydown', e => {
    if (e.key === 'Escape') onDismiss?.();
  });

  // elementFromPoint is used instead of e.target because carousel's drag handler
  // calls setPointerCapture, routing all pointer events to the items element.
  root.addEventListener('click', e => {
    const actual = document.elementFromPoint(e.clientX, e.clientY);
    if (!actual?.closest(keepOpenSelector)) onDismiss?.();
  });

  root.setAttribute('tabindex', '-1');

  return {
    open() {
      gsap.set(root, { visibility: 'visible' });
      root.focus();
      gsap.to(root, { opacity: 1, duration: 0.25 });
    },
    close(onComplete) { gsap.to(root, { autoAlpha: 0, duration: 0.2, onComplete }); },
  };
}
