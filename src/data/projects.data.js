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
  {
    id: 4,
    title: "Chat Application",
    description: "Real-time messaging app using Socket.io",
    userId: 3,
  },
  {
    id: 5,
    title: "Weather Dashboard",
    description: "Weather tracking dashboard using a public API",
    userId: 2,
  },
  {
    id: 6,
    title: "Blog Platform",
    description: "Full-stack blogging platform with authentication",
    userId: 4,
  },
  {
    id: 7,
    title: "Expense Tracker",
    description: "Personal finance and expense management app",
    userId: 1,
  },
  {
    id: 8,
    title: "Social Media App",
    description: "Social networking platform with posts and comments",
    userId: 3,
  },
  {
    id: 9,
    title: "Online Learning Platform",
    description: "Course management platform for students and instructors",
    userId: 5,
  },
  {
    id: 10,
    title: "Inventory Management System",
    description: "System for tracking products, stock, and orders",
    userId: 4,
  },
  {
    id: 11,
    title: "Recipe Finder",
    description: "Recipe discovery app with search and filtering",
    userId: 2,
  },
  {
    id: 12,
    title: "Job Board",
    description: "Platform for posting and searching job opportunities",
    userId: 5,
  },
  {
    id: 13,
    title: "Fitness Tracker",
    description: "Workout and fitness progress tracking application",
    userId: 3,
  },
  {
    id: 14,
    title: "Event Management App",
    description: "Application for creating and managing events",
    userId: 4,
  },
  {
    id: 15,
    title: "URL Shortener",
    description: "Service for generating and managing shortened URLs",
    userId: 1,
  },
  {
    id: 16,
    title: "Movie Database",
    description: "Movie browsing app with ratings and reviews",
    userId: 2,
  },
  {
    id: 17,
    title: "Customer Support System",
    description: "Ticket-based customer support management platform",
    userId: 5,
  },
  {
    id: 18,
    title: "Travel Planner",
    description: "Trip planning app for organizing destinations and itineraries",
    userId: 3,
  },
  {
    id: 19,
    title: "Music Streaming App",
    description: "Music browsing and playlist management application",
    userId: 4,
  },
  {
    id: 20,
    title: "File Storage API",
    description: "REST API for uploading, storing, and managing files",
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