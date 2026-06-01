// ─── Projects orchestrator ─────────────────────────────────────

import { fetchLang } from './lang.js';
import { renderCards } from './projects/cards.js';
import { createProjectsCarousel } from './projects/carousel.js';
import { initFilter } from './projects/filter.js';

// ─── Fetch + normalise ────────────────────────────────────────

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
    tags: tg,
    statuses: s,
    projects: projects.map(p => ({
      ...p,
      summary:  trans?.projects?.[p.title]?.summary ?? p.summary,
      category: { key: p.category, label: cats[p.category] },
      status:   p.status ? { key: p.status, label: s[p.status] } : null,
      tags:     p.tags.map(tag => ({ key: tag, label: tg[tag] }))
    }))
  };
}

export function flattenProjects({ categories, projects }) {
  return Object.keys(categories).flatMap(catKey =>
    projects.filter(p => p.category.key === catKey)
  );
}

// ─── Init ─────────────────────────────────────────────────────

export function initProjects(data, container) {
  const flat      = flattenProjects(data);
  const indexMap  = new Map(flat.map((p, i) => [p, i]));
  const carousel  = createProjectsCarousel(flat);

  renderCards(data, container, project => carousel.open(indexMap.get(project)));
  initFilter(data, container);

  return { open: index => carousel.open(index) };
}
