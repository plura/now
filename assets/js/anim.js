import { animatePluraLogoIntro, animatePluraLogoHeader } from './anim/logo.js';

const introLogo  = document.querySelector('#plura-intro svg');
const headerLogo = document.querySelector('header svg');

export function runIntroAnimation() {
  return animatePluraLogoIntro(introLogo);
}

export function runHeaderAnimation() {
  return animatePluraLogoHeader(headerLogo);
}
