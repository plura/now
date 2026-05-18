import { runIntroAnimation, runHeaderAnimation } from './anim.js';
import { imgs2svg } from './utils.js';
import { fetchProjects } from './projects.js';
import './cta.js';

// ?dev=1 skips intro animation to the end state
const DEV = new URLSearchParams(location.search).get('dev') === '1';

// Inline SVGs and fetch data in parallel before anything renders
const [, projectsData] = await Promise.all([imgs2svg(), fetchProjects()]);

runHeaderAnimation();

const tl = runIntroAnimation();
if (DEV) tl.progress(1);
