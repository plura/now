import { runIntroSequence } from './anim/intro.js';
import { animatePluraLogoHeader } from './anim/logo.js';

export function skipIntro() {
  document.getElementById('plura-intro')?.remove();
  document.documentElement.classList.add('plura-intro-done');
}

// Full intro animation:
//   1. Hide header, content, and CTA
//   2. Run intro sequence (logo draw + O expansion)
//   3. Fade in header → content → CTA slide-up; then draw header logo
export function runIntroAnimation() {
  const header  = document.querySelector('header');
  const content = document.querySelector('#plura-content');
  const cta     = document.querySelector('#plura-cta-main');

  gsap.set([header, content], { opacity: 0 });
  gsap.set(cta, { opacity: 0, y: 20 });

  return runIntroSequence(() => {
    // Fade in header and content, then draw the header logo.
    gsap.to([header, content], {
      opacity:  1,
      duration: 0.4,
      stagger:  0.15,
      ease:     'power2.out',
      onComplete: () => animatePluraLogoHeader(document.querySelector('header svg')),
    });

    // Slide up and fade in the CTA trigger.
    gsap.to(cta, {
      opacity:  1,
      y:        0,
      duration: 0.5,
      delay:    0.2,
      ease:     'back.out(1.5)',
    });
  });
}
