import { openMorph, closeMorph } from './morph.js';
import { initOverlay } from './overlay.js';

export function createFloat({ container, frame, trigger, closeBtn }, getSize, options = {}) {
  const overlay = initOverlay(container, {
    mode:             'backdrop',
    keepOpenSelector: frame,
    onBeforeOpen: () => {
      openMorph(frame, trigger.getBoundingClientRect(), getSize(), options);
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
