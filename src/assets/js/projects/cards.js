// ─── Projects cards (category grid) ───────────────────────────

import { el } from '../utils.js';
import { t } from '../lang.js';
import { buildMeta } from './meta.js';

export function renderCards({ categories, projects }, container, onItemClick) {
  const itemsByProject = new Map();
  const grid = el('div', { class: 'plura-projects' });

  for (const [catKey, catLabel] of Object.entries(categories)) {
    const catProjects = projects.filter(p => p.category.key === catKey);
    if (!catProjects.length) continue;
    grid.appendChild(buildCategoryCard(catKey, catLabel, catProjects, onItemClick, itemsByProject));
  }

  container.appendChild(grid);

  return { getItem: project => itemsByProject.get(project) };
}

function buildCategoryCard(catKey, catLabel, projects, onItemClick, itemsByProject) {
  const list = el('div', { class: 'plura-projects-list', role: 'list' });
  projects.forEach(p => list.appendChild(buildProjectItem(p, onItemClick, itemsByProject)));

  return el('div', { class: 'plura-projects-card', dataset: { category: catKey } },
    el('div', { class: 'plura-projects-card-heading' },
      el('span', { class: 'plura-projects-card-label', text: catLabel }),
      el('span', { class: 'plura-projects-card-count', text: projects.length })
    ),
    list
  );
}

function buildProjectItem(project, onItemClick, itemsByProject) {
  const item = el('div', { class: 'plura-projects-item', role: 'listitem', dataset: { title: project.title } });
  itemsByProject.set(project, item);

  item.appendChild(
    el('div', { class: 'plura-projects-item-row' },
      el('span', { class: 'plura-projects-item-title', text: project.title }),
      buildMeta(project),
      buildProjectActions(project)
    )
  );

  if (project.summary) {
    item.appendChild(
      el('p', { class: 'plura-projects-item-desc', text: project.summary })
    );
  }

  item.addEventListener('click', e => {
    if (!e.target.closest('.plura-projects-item-url')) {
      onItemClick(project);
    }
  });

  return item;
}

function buildProjectActions(project) {
  const actions = el('div', { class: 'plura-projects-item-actions' });

  if (project.url) {
    actions.appendChild(
      el('a', { class: 'plura-projects-item-url', href: project.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': t('Visit {title}', { title: project.title }) },
        el('i', { 'data-lucide': 'external-link' })
      )
    );
  }

  actions.appendChild(
    el('button', { class: 'plura-projects-item-expand', 'aria-expanded': 'false', 'aria-label': t('About {title}', { title: project.title }) },
      el('i', { 'data-lucide': 'maximize-2' })
    )
  );

  return actions;
}
