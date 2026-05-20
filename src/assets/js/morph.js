// ─── Morph / overlay animation ───────────────────────────────
// Shared open/close FLIP animation for overlay panels.
// Consumer calls openMorph with the trigger's bounding rect;
// closeMorph returns to that same rect automatically.

const origins = new WeakMap();

export function openMorph(mainEl, morphEl, fromRect, toSize) {
  origins.set(morphEl, fromRect);

  const toX = (window.innerWidth  - toSize.width)  / 2;
  const toY = (window.innerHeight - toSize.height) / 2;

  // Anchor left/top once (no animation cost), then move with transform
  gsap.set(morphEl, {
    left:   fromRect.x,
    top:    fromRect.y,
    width:  fromRect.width,
    height: fromRect.height,
    x: 0,
    y: 0,
  });

  mainEl.classList.add('active');

  gsap.to(morphEl, {
    x:      toX - fromRect.x,
    y:      toY - fromRect.y,
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
    x:      0,
    y:      0,
    width:  toRect.width,
    height: toRect.height,
    duration: 0.45,
    ease: 'power3.inOut',
    onComplete: () => mainEl.classList.remove('active'),
  });
}
