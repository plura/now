import { runIntroAnimation, skipIntro } from './anim.js';
import { imgs2svg } from './utils.js';
import { fetchProjects, initProjects } from './projects.js';
import { hasSeenIntro } from './session.js';
import './contacts-cta.js';
import dev from './dev.js';

// Inline SVGs and fetch data in parallel before anything renders
const [, projectsData] = await Promise.all([imgs2svg(), fetchProjects()]);

const content  = document.querySelector('#plura-content');
const projects = initProjects(projectsData, content);
lucide.createIcons();

if (hasSeenIntro() || dev.active) {
  skipIntro();
} else {
  runIntroAnimation();
}

dev.apply({ projects });
