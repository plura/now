// ─── Morph frame animation ────────────────────────────────────
// initMorph(frame) returns { open, close } for one frame element.
// open animates the frame from `from` to `to`; close returns it to
// the stored from-rect. `from`/`to` may each be a DOM element or a
// rect — caller decides; morph never computes position itself.
//
// open/close options:
//   hideOnComplete — set autoAlpha: 0 when that animation finishes
//                    (use for frames with no persistent resting state)
//   onComplete     — fires when that animation lands

const DURATION = 0.45;
const EASE     = 'power3.inOut';

// Accept either a DOM element (read its rect) or a rect-like object.
function resolveRect(target) {
  return target instanceof Element ? target.getBoundingClientRect() : target;
}

export function initMorph(frame) {
  let fromRect;

  function open(from, to, { hideOnComplete = false, onComplete } = {}) {
    fromRect     = resolveRect(from);
    const toRect = resolveRect(to);

    frame.classList.add('plura-morph-element');

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
      duration: DURATION,
      ease:     EASE,
      onComplete: () => {
        if (hideOnComplete) gsap.set(frame, { autoAlpha: 0 });
        onComplete?.();
      },
    });
  }

  function close({ hideOnComplete = false, onComplete } = {}) {
    if (!fromRect) return;

    gsap.to(frame, {
      x:        0,
      y:        0,
      width:    fromRect.width,
      height:   fromRect.height,
      duration: DURATION,
      ease:     EASE,
      onComplete: () => {
        frame.classList.remove('active');
        if (hideOnComplete) gsap.set(frame, { autoAlpha: 0 });
        onComplete?.();
      },
    });
  }

  return { open, close };
}
