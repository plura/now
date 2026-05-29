// Dev/testing tool — activated via ?dev=<mode> or ?dev=<mode1>,<mode2>
// Any active mode skips the intro automatically.
// Supported modes:
//   projects-carousel — open the projects carousel overlay

const param = new URLSearchParams(location.search).get('dev');
const modes = new Set(param ? param.split(',') : []);

function apply({ carousel } = {}) {
  if (modes.has('projects-carousel')) carousel?.open(0);
}

export default {
  active: modes.size > 0,
  has: m => modes.has(m),
  apply,
};
