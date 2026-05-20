import { runIntroAnimation, skipIntro } from './anim.js';
import { imgs2svg } from './utils.js';
import { fetchProjects, renderProjects } from './projects.js';
import { basePath } from './lang.js';
import { hasSeenIntro } from './session.js';
import './contacts-cta.js';
import dev from './dev.js';

// Inline SVGs and fetch data in parallel before anything renders
const [, projectsData] = await Promise.all([imgs2svg(), fetchProjects(basePath)]);

renderProjects(projectsData, document.querySelector('#plura-content'));
lucide.createIcons();

if (hasSeenIntro() || dev.mode === '1') {
  skipIntro();
} else {
  runIntroAnimation();
}
