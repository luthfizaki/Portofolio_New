import projectsContent from "../../cms/data/projects.json";

const projectList = (projectsContent as any)?.projects || [];

export function getFallbackProjects() {
  return projectList.map(({ caseStudy, ...project }: any) => project);
}

export function getFallbackProject(id: string | undefined | null) {
  if (!id) return null;
  return projectList.find((project: any) => project.id === id) || null;
}
