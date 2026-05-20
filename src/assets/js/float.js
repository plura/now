import { openMorph, closeMorph } from './morph.js';

export function createFloat({ main, morph, trigger, close }, getSize, options = {}) {
  function open() {
    openMorph(main, morph, trigger.getBoundingClientRect(), getSize(), options);
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close_() {
    closeMorph(main, morph);
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', open);
  close.addEventListener('click', close_);
  main.addEventListener('click', e => { if (e.target === main) close_(); });

  return { open, close: close_ };
}
