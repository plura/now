import { animatePluraLogoIntro } from './logo.js';
import { expandOToMain } from './logo-o.js';

export function runIntroSequence() {
  const logo   = document.querySelector('#plura-intro svg');
  const master = gsap.timeline();

  master.add(animatePluraLogoIntro(logo));
  master.call(() => expandOToMain(logo));

  return master;
}
