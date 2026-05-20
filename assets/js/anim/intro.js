import { animatePluraLogoIntro } from './logo.js';
import { expandOToMain } from './logo-o.js';
import { markIntroSeen } from '../session.js';

export function finishIntro() {
  document.getElementById('plura-intro')?.remove();
  document.documentElement.classList.add('plura-intro-done');
  markIntroSeen();
}

// Intro sequence:
//   1. Logo draws in (P L U R A), transforms, letters undraw, U closes into O
//   2. O crossfades to a CSS path, expands to cover <main>
//   3. #plura-intro removed → finishIntro fires → onComplete fires
export function runIntroSequence(onComplete) {
  const logo   = document.querySelector('#plura-intro svg');
  const master = gsap.timeline();

  master.add(animatePluraLogoIntro(logo));
  master.call(() => {
    expandOToMain(logo).then(() => {
      finishIntro();
      onComplete?.();
    });
  });

  return master;
}
