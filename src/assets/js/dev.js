const param = new URLSearchParams(location.search).get('dev');
const modes = new Set(param ? param.split(',') : []);

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
