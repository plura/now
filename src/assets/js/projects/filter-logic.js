export function filterProjects(projects, { categories, tags, statuses }) {
  return new Set(
    projects
      .filter(p =>
        (!categories.size || categories.has(p.category.key)) &&
        (!tags.size       || p.tags.some(t => tags.has(t.key))) &&
        (!statuses.size   || (p.status && statuses.has(p.status.key)))
      )
      .map(p => p.title)
  );
}
