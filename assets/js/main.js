import { runIntroAnimation } from './anim.js';
import { imgs2svg } from './utils.js';
import { fetchProjects } from './projects.js';

const DEV = new URLSearchParams(location.search).get('dev') === '1';

const [, projectsData] = await Promise.all([imgs2svg(), fetchProjects()]);

const tl = runIntroAnimation();
if (DEV) tl.progress(1);
