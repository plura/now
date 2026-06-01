// ─── Morph / overlay animation ───────────────────────────────
// Shared open/close FLIP animation for overlay panels.
// Consumer calls openMorph with the trigger's bounding rect;
// closeMorph returns to that same rect automatically.
//
// hideOnClose — set autoAlpha: 0 after close animation
//   (use for overlays with no persistent resting state)

const state = new WeakMap();

export function openMorph(container, frame, fromRect, targetSize, options = {}) {
  const { hideOnClose = false } = options;
  state.set(frame, { fromRect, hideOnClose });

  const toX = (window.innerWidth  - targetSize.width)  / 2;
  const toY = (window.innerHeight - targetSize.height) / 2;

  gsap.set(frame, {
    left:      fromRect.x,
    top:       fromRect.y,
    width:     fromRect.width,
    height:    fromRect.height,
    x:         0,
    y:         0,
    autoAlpha: 1,
  });

  container.classList.add('active');

  gsap.to(frame, {
    x:        toX - fromRect.x,
    y:        toY - fromRect.y,
    width:    targetSize.width,
    height:   targetSize.height,
    duration: 0.45,
    ease:     'power3.inOut',
  });
}

export function closeMorph(container, frame) {
  const { fromRect, hideOnClose } = state.get(frame) ?? {};
  if (!fromRect) return;

  gsap.to(frame, {
    x:        0,
    y:        0,
    width:    fromRect.width,
    height:   fromRect.height,
    duration: 0.45,
    ease:     'power3.inOut',
    onComplete: () => {
      container.classList.remove('active');
      if (hideOnClose) gsap.set(frame, { autoAlpha: 0 });
    },
  });
}
