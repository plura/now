// ─── Project detail overlay ───────────────────────────────────

import { openMorph, closeMorph } from './morph.js';
import { buildProjectMeta } from './projects.js';
import { el } from './utils.js';

const detailMain    = document.getElementById('plura-project-detail-main');
const detailMorph   = document.getElementById('plura-project-detail-morph');
const detailClose   = document.getElementById('plura-project-detail-close');
const detailContent = document.getElementById('plura-project-detail-content');

// ─── Open / close ─────────────────────────────────────────────

export function openDetail(project, fromRect) {
  populateContent(project);

  const toSize = {
    width:  Math.min(640, window.innerWidth  * 0.9),
    height: Math.min(600, window.innerHeight * 0.85),
  };

  openMorph(detailMain, detailMorph, fromRect, toSize);
}

export function closeDetail() {
  closeMorph(detailMain, detailMorph);
}

// ─── Content ──────────────────────────────────────────────────

function populateContent(project) {
  detailContent.innerHTML = '';

  detailContent.appendChild(
    el('div', { class: 'plura-project-detail-header' },
      el('h2', { class: 'plura-project-detail-title', text: project.title }),
      buildProjectMeta(project)
    )
  );

  if (project.description) {
    detailContent.appendChild(
      el('p', { class: 'plura-project-detail-desc', text: project.description })
    );
  }

  // gallery slot — populated later
}

// ─── Events ───────────────────────────────────────────────────

detailClose.addEventListener('click', closeDetail);
detailMain.addEventListener('click', e => { if (e.target === detailMain) closeDetail(); });
