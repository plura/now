// ─── Filter logic ─────────────────────────────────────────────
// OR within each group (any selected tag matches),
// AND between groups (all active groups must match).
// An empty group is ignored — no constraint applied.

export function filterItems(projects, { categories, tags, statuses }) {
  return projects.filter(p =>
    (!categories.size || categories.has(p.category.key)) &&
    (!tags.size       || p.tags.some(t => tags.has(t.key))) &&
    (!statuses.size   || (p.status && statuses.has(p.status.key)))
  );
}
