import { runIntroSequence } from './anim/intro.js';
import { animatePluraLogoHeader } from './anim/logo.js';

export function runIntroAnimation() {
  return runIntroSequence();
}

export function runHeaderAnimation() {
  return animatePluraLogoHeader(document.querySelector('header svg'));
}
