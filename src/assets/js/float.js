import { openMorph, closeMorph } from './morph.js';

export function createFloat({ container, frame, trigger, closeBtn }, getSize, options = {}) {
  function open() {
    openMorph(frame, trigger.getBoundingClientRect(), getSize(), options);
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    closeMorph(frame);
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  container.addEventListener('click', e => { if (e.target === container) close(); });

  return { open, close };
}
