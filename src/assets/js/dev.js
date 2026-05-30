// Dev/testing tool — activated via ?dev=<mode> or ?dev=<mode1>,<mode2>
// Any active mode skips the intro automatically.
// Supported modes:
//   projects-carousel[:index] — open the projects carousel overlay at optional index (default 0)

const param = new URLSearchParams(location.search).get('dev');

const modeEntries = param
  ? param.split(',').map(m => { const [name, arg] = m.split(':'); return { name, arg }; })
  : [];

const active = modeEntries.length > 0;

function get(name) {
  return modeEntries.find(m => m.name === name);
}

function apply({ carousel } = {}) {
  const carouselMode = get('projects-carousel');
  if (carouselMode) carousel?.open(Number(carouselMode.arg) || 0);
}

export default { active, apply };
