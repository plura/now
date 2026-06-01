// ─── Project meta (status + tags badges) ──────────────────────

import { el } from '../utils.js';

export function buildProjectMeta(project) {
  const meta = el('div', { class: 'plura-projects-item-meta' });

  if (project.status) {
    meta.appendChild(
      el('span', { class: `plura-badge plura-badge--outline plura-projects-status plura-projects-status--${project.status.key}`, text: project.status.label })
    );
  }

  if (project.tags.length) {
    const tagsGroup = el('div', { class: 'plura-projects-tags' });
    project.tags.forEach(tag => {
      tagsGroup.appendChild(
        el('span', { class: `plura-badge plura-badge--fill plura-projects-tag plura-projects-tag--${tag.key}`, text: tag.label })
      );
    });
    meta.appendChild(tagsGroup);
  }

  return meta;
}
