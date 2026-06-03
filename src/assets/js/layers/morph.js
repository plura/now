// ─── Morph frame animation ────────────────────────────────────
// initMorph(frame, { fade }) returns { open, close } for one frame element.
// open animates the frame from `from` to `to`; close returns it to the
// stored from-rect. `from`/`to` may each be a DOM element or a rect —
// caller decides; morph never computes position itself.
//
// fade — declares the frame transient (no resting state): it starts hidden,
//        fades in on open, and fades out when any animation completes.
//        Omit for persistent frames (e.g. floats) that stay visible at rest.
//
// open/close option:
//   onComplete — fires when that animation lands

const DURATION = 0.45;
const FADE     = 0.25;
const EASE     = 'power3.inOut';

// Accept either a DOM element (read its rect) or a rect-like object.
function resolveRect(target) {
  return target instanceof Element ? target.getBoundingClientRect() : target;
}

export function initMorph(frame, { fade = false } = {}) {
  let fromRect;

  frame.classList.add('plura-morph-element');
  if (fade) gsap.set(frame, { autoAlpha: 0 });

  function open(from, to, { onComplete } = {}) {
    fromRect     = resolveRect(from);
    const toRect = resolveRect(to);

    gsap.killTweensOf(frame);  // cancel any in-flight tween from a prior cycle (fade or morph)

    gsap.set(frame, {
      left:      fromRect.x,
      top:       fromRect.y,
      width:     fromRect.width,
      height:    fromRect.height,
      x:         0,
      y:         0,
      autoAlpha: fade ? 0 : 1,
    });

    frame.classList.add('active');

    if (fade) gsap.to(frame, { autoAlpha: 1, duration: FADE });

    gsap.to(frame, {
      x:        toRect.x - fromRect.x,
      y:        toRect.y - fromRect.y,
      width:    toRect.width,
      height:   toRect.height,
      duration: DURATION,
      ease:     EASE,
      onComplete: () => {
        if (fade) gsap.to(frame, { autoAlpha: 0, duration: FADE });
        onComplete?.();
      },
    });
  }

  function close({ onComplete } = {}) {
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
        if (fade) gsap.to(frame, { autoAlpha: 0, duration: FADE });
        onComplete?.();
      },
    });
  }

  return { open, close };
}
