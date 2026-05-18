import { animatePluraLogoIntro, LOGO_STROKE_WIDTH } from './logo.js';

// Arc radius of the U letter corners in SVG user units, from path geometry.
const SVG_ARC_RADIUS = 18.29;

const EXPAND_CROSSFADE = 0.15;
const EXPAND_DURATION  = 0.8;

// Crossfades the SVG logo out while fading in a CSS div that matches the O shape,
// then expands that div to cover <main>, morphing its border to match.
function expandOToMain(logo) {
  const svgRect = logo.getBoundingClientRect();
  const scale   = logo.viewBox.baseVal.width / svgRect.width;

  // U/O visual bounds — all U paths (incl. line-top-x) are drawn at this point.
  const uPaths  = [...logo.querySelectorAll('[id^="plura-anim-l-u-"]')];
  const uRects  = uPaths.map(el => el.getBoundingClientRect());
  const oTop    = Math.min(...uRects.map(r => r.top));
  const oLeft   = Math.min(...uRects.map(r => r.left));
  const oRight  = Math.max(...uRects.map(r => r.right));
  const oBottom = Math.max(...uRects.map(r => r.bottom));

  const main       = document.querySelector('main');
  const mainRect   = main.getBoundingClientRect();
  const mainStyle  = getComputedStyle(main);

  // Build a div styled to match the SVG O at its current position.
  const oDiv = document.createElement('div');
  oDiv.id    = 'plura-intro-o';
  document.querySelector('#plura-intro').appendChild(oDiv);
  Object.assign(oDiv.style, {
    position:     'fixed',
    top:          `${oTop}px`,
    left:         `${oLeft}px`,
    width:        `${oRight - oLeft}px`,
    height:       `${oBottom - oTop}px`,
    border:       `${LOGO_STROKE_WIDTH}px solid`,
    borderRadius: `${SVG_ARC_RADIUS / scale}px`,
    color:        getComputedStyle(logo).color,
    opacity:      '0',
  });

  return gsap.timeline({ onComplete: () => document.querySelector('#plura-intro').remove() })
    // Crossfade hides any minor visual mismatch at the SVG → div handoff.
    .to(logo, { opacity: 0, duration: EXPAND_CROSSFADE, ease: 'none' }, 0)
    .to(oDiv, { opacity: 1, duration: EXPAND_CROSSFADE, ease: 'none' }, 0)
    // Expand to <main>, morphing border radius and color to match it.
    .to(oDiv, {
      top:          mainRect.top,
      left:         mainRect.left,
      width:        mainRect.width,
      height:       mainRect.height,
      borderRadius: mainStyle.borderRadius,
      borderColor:  mainStyle.borderColor,
      ease:         'power2.inOut',
      duration:     EXPAND_DURATION,
    }, EXPAND_CROSSFADE);
}

export function runIntroSequence() {
  const logo   = document.querySelector('#plura-intro svg');
  const master = gsap.timeline();

  master.add(animatePluraLogoIntro(logo));
  master.call(() => expandOToMain(logo));

  return master;
}
