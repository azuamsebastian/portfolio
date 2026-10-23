import projects from '@/data/projects.json';

export function getProject(slug) {
  return projects.find((project) => project.slug === slug) || null;
}

export function getAllProjects() {
  return projects;
}
