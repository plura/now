import { animatePluraLogoIntro } from './logo.js';

function createExpandingO() {
  const div = document.createElement('div');
  div.id = 'plura-intro-o';
  document.querySelector('#plura-intro').appendChild(div);
  return div;
}

export function runIntroSequence() {
  const logo = document.querySelector('#plura-intro svg');
  const oDiv = createExpandingO();

  const master = gsap.timeline({
    onComplete: () => document.querySelector('#plura-intro').remove(),
  });

  master.add(animatePluraLogoIntro(logo));

  // TODO: animate oDiv expanding to match <main> bounds, then remove

  return master;
}
