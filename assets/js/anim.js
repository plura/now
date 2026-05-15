import { animatePluraLogoIntro, animatePluraLogoHeader } from './anim/logo.js';

export function runIntroAnimation() {
  return animatePluraLogoIntro(document.querySelector('#plura-intro svg'));
}

export function runHeaderAnimation() {
  return animatePluraLogoHeader(document.querySelector('header svg'));
}
