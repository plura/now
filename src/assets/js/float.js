import { openMorph, closeMorph } from './morph.js';
import { initOverlay } from './overlay.js';

export function createFloat({ container, frame, trigger, closeBtn }, getSize, options = {}) {
  const overlay = initOverlay(container, {
    static:           true,
    keepOpenSelector: frame,
    onBeforeOpen: () => {
      openMorph(frame, trigger, centerRect(getSize()), options);
      trigger.setAttribute('aria-expanded', 'true');
    },
    onClose: () => {
      closeMorph(frame);
      trigger.setAttribute('aria-expanded', 'false');
    },
  });

  trigger.addEventListener('click', overlay.open);
  closeBtn.addEventListener('click', overlay.close);

  return overlay;
}

// Centre a { width, height } in the viewport, returning a full rect.
function centerRect({ width, height }) {
  return {
    x:      (window.innerWidth  - width)  / 2,
    y:      (window.innerHeight - height) / 2,
    width,
    height,
  };
}
