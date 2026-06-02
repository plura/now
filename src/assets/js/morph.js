// ─── Morph frame animation ────────────────────────────────────
// Animates a frame element between two rects via GSAP.
// openMorph snaps the frame to fromRect then animates to toRect.
// closeMorph returns to the stored fromRect.
// Caller decides both rects — morph never computes position itself.
//
// options.hideOnClose — set autoAlpha: 0 after close animation
//   (use for overlays with no persistent resting state)

const state = new WeakMap();

export function openMorph(frame, fromRect, toRect, options = {}) {
  const { hideOnClose = false } = options;
  state.set(frame, { fromRect, hideOnClose });

  gsap.set(frame, {
    left:      fromRect.x,
    top:       fromRect.y,
    width:     fromRect.width,
    height:    fromRect.height,
    x:         0,
    y:         0,
    autoAlpha: 1,
  });

  frame.classList.add('active');

  gsap.to(frame, {
    x:        toRect.x - fromRect.x,
    y:        toRect.y - fromRect.y,
    width:    toRect.width,
    height:   toRect.height,
    duration: 0.45,
    ease:     'power3.inOut',
  });
}

export function closeMorph(frame) {
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
      frame.classList.remove('active');
      if (hideOnClose) gsap.set(frame, { autoAlpha: 0 });
    },
  });
}
