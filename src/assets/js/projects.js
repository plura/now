import { el } from './utils.js';
import { openDetail } from './project-detail.js';
import { t, fetchLang } from './lang.js';

export async function fetchProjects(base = '.') {
  const [data, trans] = await Promise.all([
    fetch(`${base}/data/projects.json`).then(r => r.json()),
    fetchLang(base, 'projects')
  ]);
  return normalize(data, trans);
}

function normalize({ statuses, tags, categories, projects }, trans = null) {
  const s    = trans ? { ...statuses,   ...trans.statuses   } : statuses;
  const tg   = trans ? { ...tags,       ...trans.tags       } : tags;
  const cats = trans ? { ...categories, ...trans.categories } : categories;

  return {
    categories: cats,
    projects: projects.map(p => ({
      ...p,
      summary:  trans?.projects?.[p.title]?.summary ?? p.summary,
      category: { key: p.category, label: cats[p.category] },
      status:   p.status ? { key: p.status, label: s[p.status] } : null,
      tags:     p.tags.map(tag => ({ key: tag, label: tg[tag] }))
    }))
  };
}

export function renderProjects({ categories, projects }, container) {
  const grid = el('div', { class: 'plura-projects' });

  for (const [catKey, catLabel] of Object.entries(categories)) {
    const catProjects = projects.filter(p => p.category.key === catKey);
    if (!catProjects.length) continue;

    const card = buildCategoryCard(catKey, catLabel, catProjects);
    grid.appendChild(card);
  }

  container.appendChild(grid);
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

  if (project.summary) {
    item.appendChild(
      el('p', { class: 'plura-projects-item-desc', text: project.summary })
    );
  }

  item.addEventListener('click', e => {
    if (!e.target.closest('.plura-projects-item-url')) {
      openDetail(project, item.getBoundingClientRect());
    }
  });

  return item;
}

export function buildProjectMeta(project) {
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
