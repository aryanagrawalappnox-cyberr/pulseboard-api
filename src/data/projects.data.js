const projects = [
  {
    id: 1,
    title: "Task Manager API",
    description: "Backend API built with Express.js",
    userId: 1,
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "Personal portfolio using React",
    userId: 2,
  },
  {
    id: 3,
    title: "E-commerce App",
    description: "Online shopping platform",
    userId: 1,
  },
];

export function getAllProjectsData() {
  return projects;
}

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}

export function createProject(projectData) {
  const { title, description, userId } = projectData;

  const nextId = projects.length === 0 ? 1 : projects[projects.length - 1].id + 1;

  const newProject = {
    id: nextId,
    title,
    description,
    userId,
  };

  projects.push(newProject);

  return newProject;
}

export function updateProject(projectId, projectData){

  const project = getProjectById(projectId);

  if (!project) {
        return undefined;
    }

  Object.assign(project, projectData);

  return project;
}

export function deleteProject(projectId) {
  const projectIndex = projects.findIndex((p) => p.id === projectId);

  if (projectIndex === -1) {
    return undefined;
  }

  const deletedProject = projects.splice(projectIndex, 1);

  return deletedProject;
}