// ─── Transition ───────────────────────────────────────────────
// A one element-to-element morph using a single reusable ghost frame.
// The ghost is opaque and sits above everything (--plura-z-transition),
// so it masks whatever is behind it while travelling — letting callers
// fade content in/out underneath in parallel without a double image.

import { initMorph } from './morph.js';
import { el } from './utils.js';

const ghost = el('div', { class: 'plura-morph-element plura-transition-ghost' });
document.body.appendChild(ghost);
gsap.set(ghost, { autoAlpha: 0 });

const morph = initMorph(ghost);

// Morph the ghost from one element/rect to another, hiding it on arrival.
export function transition(from, to, { onComplete } = {}) {
  morph.open(from, to, { hideOnComplete: true, onComplete });
}
