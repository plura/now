// ─── Project detail overlay ───────────────────────────────────

import { openMorph, closeMorph } from '../morph.js';
import { buildMeta } from './meta.js';
import { el } from '../utils.js';

const detailContainer = document.getElementById('plura-project-detail');
const detailFrame     = document.getElementById('plura-project-detail-morph');
const detailClose     = document.getElementById('plura-project-detail-close');
const detailContent   = document.getElementById('plura-project-detail-content');

gsap.set(detailFrame, { autoAlpha: 0 });

// ─── Open / close ─────────────────────────────────────────────

export function openDetail(project, fromRect) {
  populateContent(project);

  const width  = Math.min(640, window.innerWidth  * 0.9);
  const height = Math.min(600, window.innerHeight * 0.85);
  const toRect = {
    x: (window.innerWidth  - width)  / 2,
    y: (window.innerHeight - height) / 2,
    width,
    height,
  };

  openMorph(detailFrame, fromRect, toRect, { hideOnClose: true });
}

export function closeDetail() {
  closeMorph(detailFrame);
}

// ─── Content ──────────────────────────────────────────────────

function populateContent(project) {
  detailContent.innerHTML = '';

  detailContent.appendChild(
    el('div', { class: 'plura-project-detail-header' },
      el('h2', { class: 'plura-project-detail-title', text: project.title }),
      el('span', { class: 'plura-project-detail-category', text: project.category.label }),
      buildMeta(project)
    )
  );

  if (project.summary) {
    detailContent.appendChild(
      el('p', { class: 'plura-project-detail-desc', text: project.summary })
    );
  }

  // gallery slot — populated later
}

// ─── Events ───────────────────────────────────────────────────

detailClose.addEventListener('click', closeDetail);
detailContainer.addEventListener('click', e => { if (e.target === detailContainer) closeDetail(); });
