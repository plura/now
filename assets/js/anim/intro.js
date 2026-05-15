import { animatePluraLogoIntro, getCapOverhang } from './logo.js';

function positionODiv(oDiv, logo) {
  const uPaths = [...logo.querySelectorAll('[id^="plura-anim-l-u-"]')]
    .filter(el => !el.id.endsWith('-x'));

  const capOverhang = getCapOverhang(uPaths[0]);
  const rects       = uPaths.map(el => el.getBoundingClientRect());

  const top    = Math.min(...rects.map(r => r.top))    - capOverhang;
  const left   = Math.min(...rects.map(r => r.left))   - capOverhang;
  const right  = Math.max(...rects.map(r => r.right))  + capOverhang;
  const bottom = Math.max(...rects.map(r => r.bottom)) + capOverhang;

  Object.assign(oDiv.style, {
    top:    `${top}px`,
    left:   `${left}px`,
    width:  `${right - left}px`,
    height: `${bottom - top}px`,
  });
}

function createExpandingO() {
  const div = document.createElement('div');
  div.id = 'plura-intro-o';
  document.querySelector('#plura-intro').appendChild(div);
  return div;
}

export function runIntroSequence() {
  const logo = document.querySelector('#plura-intro svg');
  const oDiv = createExpandingO();

  positionODiv(oDiv, logo);

  const master = gsap.timeline({
    // onComplete: () => document.querySelector('#plura-intro').remove(),
  });

  master.add(animatePluraLogoIntro(logo));

  // TODO: animate oDiv expanding to match <main> bounds, then remove

  return master;
}
