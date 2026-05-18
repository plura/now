import { el } from './utils.js';

export async function fetchProjects() {
  const res = await fetch('./projects.json');
  const data = await res.json();
  return normalize(data);
}

function normalize({ statuses, tags, categories, projects }) {
  return {
    categories,
    projects: projects.map(p => ({
      ...p,
      status: p.status ? { key: p.status, label: statuses[p.status] } : null,
      tags: p.tags.map(t => ({ key: t, label: tags[t] }))
    }))
  };
}

export function renderProjects({ categories, projects }, container) {
  for (const [catKey, catLabel] of Object.entries(categories)) {
    const catProjects = projects.filter(p => p.category === catKey);
    if (!catProjects.length) continue;

    const card = buildCategoryCard(catKey, catLabel, catProjects);
    container.appendChild(card);
  }
}

function buildCategoryCard(catKey, catLabel, projects) {
  const list = el('div', { class: 'plura-projects-list', role: 'list' });
  projects.forEach(p => list.appendChild(buildProjectItem(p)));

  return el('div', { class: 'plura-projects-card', dataset: { category: catKey } },
    el('div', { class: 'plura-projects-card-heading' },
      el('span', { class: 'plura-projects-card-label', text: catLabel }),
      el('span', { class: 'plura-projects-card-count', text: projects.length })
    ),
    list
  );
}

function buildProjectItem(project) {
  const item = el('div', { class: 'plura-projects-item', role: 'listitem' });

  const row = el('div', { class: 'plura-projects-item-row' },
    el('span', { class: 'plura-projects-item-title', text: project.title }),
    buildProjectMeta(project),
    buildProjectActions(project)
  );

  item.appendChild(row);
  return item;
}

function buildProjectMeta(project) {
  const meta = el('div', { class: 'plura-projects-item-meta' });

  if (project.status) {
    meta.appendChild(
      el('span', { class: `plura-projects-status plura-projects-status--${project.status.key}`, text: project.status.label })
    );
  }

  if (project.tags.length) {
    const tagsGroup = el('div', { class: 'plura-projects-tags' });
    project.tags.forEach(tag => {
      tagsGroup.appendChild(
        el('span', { class: `plura-projects-tag plura-projects-tag--${tag.key}`, text: tag.label })
      );
    });
    meta.appendChild(tagsGroup);
  }

  return meta;
}

function buildProjectActions(project) {
  const actions = el('div', { class: 'plura-projects-item-actions' });

  if (project.url) {
    actions.appendChild(
      el('a', { class: 'plura-projects-item-url', href: project.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Visit ${project.title}` },
        el('i', { 'data-lucide': 'external-link' })
      )
    );
  }

  actions.appendChild(
    el('button', { class: 'plura-projects-item-expand', 'aria-expanded': 'false', 'aria-label': `About ${project.title}` },
      el('i', { 'data-lucide': 'chevron-down' })
    )
  );

  return actions;
}
