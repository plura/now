import { animatePluraLogoIntro, getCapOverhang } from './logo.js';

// Arc radius of the U letter corners in SVG user units, from path geometry.
const SVG_ARC_RADIUS = 18.29;

// Returns the visual style values needed to match the O div to the SVG stroke.
function getStyleFromSVG(logo) {
  const path  = logo.querySelector('path');
  const scale = logo.viewBox.baseVal.width / logo.getBoundingClientRect().width;

  return {
    borderWidth:  parseFloat(getComputedStyle(path).strokeWidth),
    borderRadius: SVG_ARC_RADIUS / scale,
  };
}

function styleODiv(oDiv, style) {
  Object.assign(oDiv.style, {
    border:       `${style.borderWidth}px solid`,
    borderRadius: `${style.borderRadius}px`,
  });
}

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

  styleODiv(oDiv, getStyleFromSVG(logo));
  positionODiv(oDiv, getCoordsFromU(logo));

  const observer = new ResizeObserver(() => positionODiv(oDiv, getCoordsFromU(logo)));
  observer.observe(document.body);

  const master = gsap.timeline({
    // TODO: hide logo, disconnect observer, tween oDiv to getCoordsFromMain(), then remove #plura-intro
    onComplete: () => gsap.set(logo, { visibility: 'hidden' }),
  });

  master.add(animatePluraLogoIntro(logo));

  return master;
}
