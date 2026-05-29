import { runIntroAnimation, skipIntro } from './anim.js';
import { imgs2svg } from './utils.js';
import { fetchProjects, renderProjects } from './projects.js';
import { initFilter } from './projects/filter.js';
import { createProjectsCarousel } from './projects/carousel.js';
import { basePath } from './lang.js';
import { hasSeenIntro } from './session.js';
import './contacts-cta.js';
import dev from './dev.js';

// Inline SVGs and fetch data in parallel before anything renders
const [, projectsData] = await Promise.all([imgs2svg(), fetchProjects(basePath)]);

const content = document.querySelector('#plura-content');
renderProjects(projectsData, content);
initFilter(projectsData, content);
const carousel = createProjectsCarousel(projectsData);
lucide.createIcons();

if (hasSeenIntro() || dev.active) {
  skipIntro();
} else {
  runIntroAnimation();
}

dev.apply({ carousel });
