import { runIntroAnimation, runHeaderAnimation } from './anim.js';
import { imgs2svg } from './utils.js';
import { fetchProjects, renderProjects } from './projects.js';
import './cta.js';
import dev from './dev.js';

// Inline SVGs and fetch data in parallel before anything renders
const [, projectsData] = await Promise.all([imgs2svg(), fetchProjects()]);

renderProjects(projectsData, document.querySelector('main'));
lucide.createIcons();

runHeaderAnimation();

const tl = runIntroAnimation();
if (dev.mode === '1') tl.progress(1);
