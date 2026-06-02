// ─── Projects orchestrator ─────────────────────────────────────
// Fetches and normalises data, then wires cards, carousel, and filter together.
// Cards and carousel both expose setItems — the filter callback keeps them in sync.

import { fetchLang } from './lang.js';
import { transition } from './layers/transition.js';
import { renderCards } from './projects/cards.js';
import { createCarousel } from './projects/carousel.js';
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
  const flat = flattenProjects(data);

  // Both updated on each filter change so card clicks always open the correct carousel index.
  let currentFlat    = flat;
  let indexByProject = new Map(flat.map((p, i) => [p, i]));

  const cards    = renderCards(data, container, project => openProject(indexByProject.get(project)));
  const carousel = createCarousel(flat, { onDismiss: closeProject });

  initFilter(data, flat, filtered => {
    currentFlat     = filtered;
    indexByProject = new Map(filtered.map((p, i) => [p, i]));
    cards.setItems(filtered);
    carousel.setItems(filtered);
  });

  // Open: position the slide (hidden), morph the ghost from the card to the
  // slide, then reveal the carousel the instant the ghost lands (seamless swap).
  function openProject(index) {
    carousel.goTo(index, false);
    transition(cards.getItem(currentFlat[index]), carousel.slideAt(index), {
      onComplete: carousel.reveal,
    });
  }

  // Close: dismissal fades the overlay out (via carousel's onDismiss); here we
  // morph the ghost from the current slide back to the current project's card.
  function closeProject() {
    const i = carousel.currentIndex();
    transition(carousel.slideAt(i), cards.getItem(currentFlat[i]));
  }

  return { open: openProject };
}
