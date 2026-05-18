import { animatePluraLogoIntro } from './logo.js';
import { expandOToMain } from './logo-o.js';

// Intro sequence:
//   1. Logo draws in (P L U R A), transforms, letters undraw, U closes into O
//   2. O crossfades to a CSS path, expands to cover <main>
//   3. #plura-intro removed → onComplete fires
export function runIntroSequence(onComplete) {
  const logo   = document.querySelector('#plura-intro svg');
  const master = gsap.timeline();

  master.add(animatePluraLogoIntro(logo));
  master.call(() => expandOToMain(logo, () => {
    document.documentElement.classList.add('plura-intro-done');
    onComplete?.();
  }));

  return master;
}
