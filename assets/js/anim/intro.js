import { animatePluraLogoIntro, getCapOverhang } from './logo.js';

function getCoordsFromU(logo) {
  const uPaths     = [...logo.querySelectorAll('[id^="plura-anim-l-u-"]')]
    .filter(el => !el.id.endsWith('-x'));
  const capOverhang = getCapOverhang(uPaths[0]);
  const rects       = uPaths.map(el => el.getBoundingClientRect());

  const top    = Math.min(...rects.map(r => r.top))    - capOverhang;
  const left   = Math.min(...rects.map(r => r.left))   - capOverhang;
  const right  = Math.max(...rects.map(r => r.right))  + capOverhang;
  const bottom = Math.max(...rects.map(r => r.bottom)) + capOverhang;

  return { top, left, width: right - left, height: bottom - top };
}

function getCoordsFromMain() {
  const { top, left, width, height } = document.querySelector('main').getBoundingClientRect();
  return { top, left, width, height };
}

function positionODiv(oDiv, coords) {
  Object.assign(oDiv.style, {
    top:    `${coords.top}px`,
    left:   `${coords.left}px`,
    width:  `${coords.width}px`,
    height: `${coords.height}px`,
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

  positionODiv(oDiv, getCoordsFromU(logo));

  const observer = new ResizeObserver(() => positionODiv(oDiv, getCoordsFromU(logo)));
  observer.observe(document.body);

  const master = gsap.timeline({
    // onComplete: () => document.querySelector('#plura-intro').remove(),
  });

  master.add(animatePluraLogoIntro(logo));

  // TODO: on intro complete, disconnect observer and tween oDiv to getCoordsFromMain()

  return master;
}
