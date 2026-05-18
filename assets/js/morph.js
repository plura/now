// ─── Morph / overlay animation ───────────────────────────────
// Shared open/close FLIP animation for overlay panels.
// Consumer calls openMorph with the trigger's bounding rect;
// closeMorph returns to that same rect automatically.

const origins = new WeakMap();

export function openMorph(mainEl, morphEl, fromRect, toSize) {
  origins.set(morphEl, fromRect);

  const toX = (window.innerWidth  - toSize.width)  / 2;
  const toY = (window.innerHeight - toSize.height) / 2;

  gsap.set(morphEl, {
    left:   fromRect.x,
    top:    fromRect.y,
    width:  fromRect.width,
    height: fromRect.height,
  });

  mainEl.classList.add('active');

  gsap.to(morphEl, {
    left:   toX,
    top:    toY,
    width:  toSize.width,
    height: toSize.height,
    duration: 0.45,
    ease: 'power3.inOut',
  });
}

export function closeMorph(mainEl, morphEl) {
  const toRect = origins.get(morphEl);
  if (!toRect) return;

  gsap.to(morphEl, {
    left:   toRect.x,
    top:    toRect.y,
    width:  toRect.width,
    height: toRect.height,
    duration: 0.45,
    ease: 'power3.inOut',
    onComplete: () => mainEl.classList.remove('active'),
  });
}
