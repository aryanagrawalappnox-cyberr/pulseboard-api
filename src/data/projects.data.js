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