import { animatePluraLogoIntro } from './logo.js';
import { expandOToMain } from './logo-o.js';

const FADE_IN_DURATION = 0.4;
const FADE_IN_STAGGER  = 0.15;

export function runIntroSequence() {
  const logo    = document.querySelector('#plura-intro svg');
  const header  = document.querySelector('header');
  const content = document.querySelector('#plura-content');

  // Keep header and content invisible until the expansion completes.
  gsap.set([header, content], { opacity: 0 });

  const master = gsap.timeline();

  master.add(animatePluraLogoIntro(logo));
  master.call(() => expandOToMain(logo, () => {
    // main's border is now visible — fade in header then content.
    gsap.to([header, content], {
      opacity:  1,
      duration: FADE_IN_DURATION,
      stagger:  FADE_IN_STAGGER,
      ease:     'power2.out',
    });
  }));

  return master;
}
