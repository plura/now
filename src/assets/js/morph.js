// ─── Morph / overlay animation ───────────────────────────────
// Shared open/close FLIP animation for overlay panels.
// Consumer calls openMorph with the trigger's bounding rect;
// closeMorph returns to that same rect automatically.
//
// options.hideOnClose — set autoAlpha: 0 after close animation
//   (use for overlays with no persistent resting state)

const state = new WeakMap();

export function openMorph(mainEl, morphEl, fromRect, toSize, options = {}) {
  state.set(morphEl, { fromRect, options });

  const toX = (window.innerWidth  - toSize.width)  / 2;
  const toY = (window.innerHeight - toSize.height) / 2;

  gsap.set(morphEl, {
    left:      fromRect.x,
    top:       fromRect.y,
    width:     fromRect.width,
    height:    fromRect.height,
    x:         0,
    y:         0,
    autoAlpha: 1,
  });

  mainEl.classList.add('active');

  gsap.to(morphEl, {
    x:        toX - fromRect.x,
    y:        toY - fromRect.y,
    width:    toSize.width,
    height:   toSize.height,
    duration: 0.45,
    ease:     'power3.inOut',
  });
}

export function closeMorph(mainEl, morphEl) {
  const { fromRect, options } = state.get(morphEl) ?? {};
  if (!fromRect) return;

  gsap.to(morphEl, {
    x:        0,
    y:        0,
    width:    fromRect.width,
    height:   fromRect.height,
    duration: 0.45,
    ease:     'power3.inOut',
    onComplete: () => {
      mainEl.classList.remove('active');
      if (options.hideOnClose) gsap.set(morphEl, { autoAlpha: 0 });
    },
  });
}
