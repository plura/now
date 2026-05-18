import { LOGO_STROKE_WIDTH } from './logo.js';

// Arc radius of the U letter corners in SVG user units, from path geometry.
const SVG_ARC_RADIUS = 18.29;

const CROSSFADE_DURATION = 0.15;
const EXPAND_DURATION    = 0.8;

// Builds a closed rounded-rectangle SVG path string from plain parameters.
// All values are in the SVG's coordinate space (screen px when no viewBox is set).
function roundedRectPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  return [
    `M ${x + r},${y}`,
    `H ${x + w - r}`,
    `A ${r},${r} 0 0,1 ${x + w},${y + r}`,
    `V ${y + h - r}`,
    `A ${r},${r} 0 0,1 ${x + w - r},${y + h}`,
    `H ${x + r}`,
    `A ${r},${r} 0 0,1 ${x},${y + h - r}`,
    `V ${y + r}`,
    `A ${r},${r} 0 0,1 ${x + r},${y}`,
    'Z',
  ].join(' ');
}

// Creates a full-screen fixed SVG (no viewBox — coordinates map 1:1 to screen px),
// crossfades from the logo to a rounded-rect path matching the O shape, then
// expands that path to cover <main>.
export function expandOToMain(logo) {
  const svgRect = logo.getBoundingClientRect();
  const scale   = logo.viewBox.baseVal.width / svgRect.width;

  // U/O visual bounds in screen px — all U paths are drawn at this point.
  const uPaths  = [...logo.querySelectorAll('[id^="plura-anim-l-u-"]')];
  const uRects  = uPaths.map(el => el.getBoundingClientRect());
  const oLeft   = Math.min(...uRects.map(r => r.left));
  const oTop    = Math.min(...uRects.map(r => r.top));
  const oRight  = Math.max(...uRects.map(r => r.right));
  const oBottom = Math.max(...uRects.map(r => r.bottom));

  const main       = document.querySelector('main');
  const mainRect   = main.getBoundingClientRect();
  const mainStyle  = getComputedStyle(main);

  // Full-screen SVG — no viewBox so coordinates are 1:1 with CSS px.
  const oSvg  = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const oPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  Object.assign(oSvg.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', opacity: '0' });
  oPath.setAttribute('fill', 'none');
  oPath.setAttribute('stroke-width', LOGO_STROKE_WIDTH);
  oPath.style.stroke = getComputedStyle(logo).color;

  const proxy = {
    x: oLeft,
    y: oTop,
    w: oRight  - oLeft,
    h: oBottom - oTop,
    r: SVG_ARC_RADIUS / scale,
  };
  oPath.setAttribute('d', roundedRectPath(proxy.x, proxy.y, proxy.w, proxy.h, proxy.r));

  oSvg.appendChild(oPath);
  document.querySelector('#plura-intro').appendChild(oSvg);

  return gsap.timeline({ onComplete: () => document.querySelector('#plura-intro').remove() })
    // Crossfade: logo out, O path in.
    .to(logo,  { opacity: 0, duration: CROSSFADE_DURATION, ease: 'none' }, 0)
    .to(oSvg,  { opacity: 1, duration: CROSSFADE_DURATION, ease: 'none' }, 0)
    // Expand path to <main>, morphing radius and stroke color.
    .to(proxy, {
      x: mainRect.left,
      y: mainRect.top,
      w: mainRect.width,
      h: mainRect.height,
      r: parseFloat(mainStyle.borderRadius),
      ease:     'power2.inOut',
      duration: EXPAND_DURATION,
      onUpdate: () => oPath.setAttribute('d', roundedRectPath(proxy.x, proxy.y, proxy.w, proxy.h, proxy.r)),
    }, CROSSFADE_DURATION)
    .to(oPath, {
      stroke:   mainStyle.borderColor,
      ease:     'power2.inOut',
      duration: EXPAND_DURATION,
    }, CROSSFADE_DURATION);
}
