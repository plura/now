import { animatePluraLogoIntro } from './logo.js';

export function runIntroSequence() {
  const logo = document.querySelector('#plura-intro svg');
  const main = document.querySelector('main');
  return animatePluraLogoIntro(logo, main);
}
