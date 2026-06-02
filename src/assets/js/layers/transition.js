// ─── Transition ───────────────────────────────────────────────
// A one element-to-element morph using a single reusable ghost frame.
// The ghost is opaque and sits above everything (--plura-z-transition),
// so it masks whatever is behind it while travelling — letting callers
// fade content in/out underneath in parallel without a double image.

import { initMorph } from './morph.js';
import { el } from '../utils.js';

const ghost = el('div', { class: 'plura-morph-element plura-transition-ghost' });
document.body.appendChild(ghost);

const morph = initMorph(ghost, { fade: true });

// Morph the ghost from one element/rect to another. The fade lifecycle
// (start hidden, fade in, fade out on arrival) is handled by initMorph.
export function transition(from, to, { onComplete } = {}) {
  morph.open(from, to, { onComplete });
}
