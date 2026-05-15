export async function fetchProjects() {
  const res = await fetch('./projects.json');
  return res.json();
}
