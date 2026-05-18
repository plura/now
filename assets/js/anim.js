import { runIntroSequence } from './anim/intro.js';
import { animatePluraLogoHeader } from './anim/logo.js';

export function runIntroAnimation() {
  const header  = document.querySelector('header');
  const content = document.querySelector('#plura-content');

  gsap.set([header, content], { opacity: 0 });

  return runIntroSequence(() => {
    // Fade in header and content, then draw the header logo.
    gsap.to([header, content], {
      opacity:  1,
      duration: 0.4,
      stagger:  0.15,
      ease:     'power2.out',
      onComplete: () => animatePluraLogoHeader(document.querySelector('header svg')),
    });
  });
}
