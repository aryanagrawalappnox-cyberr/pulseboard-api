import {
  getAllProjectsData,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from "../data/projects.data.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const getAllProjects = (req, res) => {
  const projects = getAllProjectsData();

  return sendSuccess(res, 200, projects);
};

export const getProjectByIdController = (req, res) => {
  const projectId = Number(req.params.projectId);

  const project = getProjectById(projectId);

  if (!project) return sendError(res, 404, "Project not found");

  return sendSuccess(res, 200, project);  
};

export const createProjectController = (req, res) => {
  const newProject = createProject(req.body);

  return sendSuccess(res, 201, newProject);
};

export const updateProjectController = (req,res) => {

    const projectId = Number(req.params.projectId);
    const updatedProject = updateProject(projectId, req.body);

    if (!updatedProject) return sendError(res, 404, "Project not found");

    return sendSuccess(res, 200, updatedProject);
}

export const deleteProjectController = (req, res) => {
    const projectId = Number(req.params.projectId);

    const deletedProject = deleteProject(projectId);

    if (!deletedProject) return sendError(res, 404, "Project not found");

    return sendSuccess(res, 200, deletedProject);
};