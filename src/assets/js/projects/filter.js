import { el } from '../utils.js';
import { createFloat } from '../float.js';
import { t } from '../lang.js';
import { filterProjects } from './filter-logic.js';

const filterMain    = document.getElementById('plura-projects-filter');
const filterMorph   = document.getElementById('plura-projects-filter-morph');
const filterTrigger = document.getElementById('plura-projects-filter-trigger');
const filterClose   = document.getElementById('plura-projects-filter-close');
const filterPanel   = document.getElementById('plura-projects-filter-panel');

// ─── State ────────────────────────────────────────────────────

const active = {
  categories: new Set(),
  tags:       new Set(),
  statuses:   new Set(),
};

let _container;
let _projects;

function hasActive() {
  return active.categories.size || active.tags.size || active.statuses.size;
}

// ─── Init ─────────────────────────────────────────────────────

export function initFilter(data, projectsContainer) {
  buildPanel(data);

  createFloat(
    { main: filterMain, morph: filterMorph, trigger: filterTrigger, close: filterClose },
    () => ({
      width:  Math.min(320, window.innerWidth  * 0.9),
      height: Math.min(480, window.innerHeight * 0.85),
    })
  );

  _container = projectsContainer;
  _projects  = data.projects;
}

// ─── Panel ────────────────────────────────────────────────────

let clearBtn;

function buildPanel(data) {
  const usedTags     = new Set(data.projects.flatMap(p => p.tags.map(t => t.key)));
  const usedStatuses = new Set(data.projects.map(p => p.status?.key).filter(Boolean));

  const groups = [
    {
      key:   'categories',
      label: t('Categories'),
      items: Object.entries(data.categories).map(([key, label]) => ({ key, label })),
    },
    {
      key:   'tags',
      label: t('Tags'),
      items: Object.entries(data.tags)
        .filter(([key]) => usedTags.has(key))
        .map(([key, label]) => ({ key, label })),
    },
    {
      key:   'statuses',
      label: t('Status'),
      items: Object.entries(data.statuses)
        .filter(([key]) => usedStatuses.has(key))
        .map(([key, label]) => ({ key, label })),
    },
  ];

  clearBtn = el('button', {
    class:  'plura-btn plura-btn--minimal',
    text:   t('Clear'),
    hidden: '',
  });
  clearBtn.addEventListener('click', clearFilter);

  const content = el('div', { class: 'plura-projects-filter-content' });
  groups.forEach(group => {
    if (!group.items.length) return;
    content.appendChild(buildGroup(group));
  });

  const panelHeader = filterPanel.querySelector('.plura-panel-header');
  const panelBody   = filterPanel.querySelector('.plura-panel-body');

  panelHeader.appendChild(el('span', { class: 'plura-panel-title', text: t('Filter') }));
  panelBody.appendChild(content);
  panelBody.appendChild(clearBtn);
}

function buildGroup({ key, label, items }) {
  const options = el('div', { class: 'plura-projects-filter-options' });
  items.forEach(item => options.appendChild(buildOption(key, item)));

  return el('div', { class: 'plura-projects-filter-group' },
    el('span', { class: 'plura-projects-filter-group-label', text: label }),
    options
  );
}

function buildOption(groupKey, { key, label }) {
  const btn = el('button', {
    class:          'plura-badge plura-badge--outline plura-projects-filter-option',
    'data-group':   groupKey,
    'data-key':     key,
    'aria-pressed': 'false',
    text:           label,
  });

  btn.addEventListener('click', () => toggleOption(btn, groupKey, key));
  return btn;
}

// ─── Toggle + filter ──────────────────────────────────────────

function toggleOption(btn, groupKey, key) {
  const set = active[groupKey];
  if (set.has(key)) {
    set.delete(key);
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('plura-badge--active');
  } else {
    set.add(key);
    btn.setAttribute('aria-pressed', 'true');
    btn.classList.add('plura-badge--active');
  }
  applyFilter();
}

function clearFilter() {
  active.categories.clear();
  active.tags.clear();
  active.statuses.clear();

  filterPanel.querySelectorAll('.plura-projects-filter-option').forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('plura-badge--active');
  });

  applyFilter();
}

function applyFilter() {
  clearBtn.hidden = !hasActive();

  const passing = filterProjects(_projects, active);

  _container.querySelectorAll('.plura-projects-item').forEach(item => {
    item.classList.toggle('plura-projects-item--filtered', !passing.has(item.dataset.title));
  });

  _container.querySelectorAll('.plura-projects-card').forEach(card => {
    const visible = card.querySelectorAll('.plura-projects-item:not(.plura-projects-item--filtered)').length;
    card.classList.toggle('plura-projects-card--filtered', !visible);
  });
}
