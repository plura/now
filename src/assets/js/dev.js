// Dev/testing tool — activated via ?dev=<mode> or ?dev=<mode1>,<mode2>
// Supported modes:
//   no-intro          — skip the intro animation
//   projects-carousel — open the projects carousel overlay (implies no-intro)

const param = new URLSearchParams(location.search).get('dev');
const modes = new Set(param ? param.split(',') : []);

// Modes that require the page to be in a settled (post-intro) state
const NEEDS_SETTLED = new Set(['projects-carousel']);
const needsSettled = [...modes].some(m => NEEDS_SETTLED.has(m));

function apply() {
  if (modes.has('projects-carousel')) {
    document.querySelector('.plura-projects-carousel')?.classList.add('is-open');
  }
}

export default {
  active: modes.size > 0,
  has: m => modes.has(m),
  needsSettled,
  apply,
};
