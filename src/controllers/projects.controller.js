import {getAllProjectsData, getProjectById, createProject, updateProject, deleteProject} from "../data/projects.data.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { createProjectSchema, updateProjectSchema } from "../schemas/project.schema.js";
import { formatValidationErrors } from "../utils/validation.js";

// export const getAllProjects = (req, res) => {

//   const pageNumber = Number(req.query.page) || 1;
//   const limitNumber = Number(req.query.limit) || 10;
//   const userId = Number(req.query.userId);
//   const sort = req.query.sort;

//   let projects = getAllProjectsData();

//   if(userId !== undefined) projects = projects.filter(project => project.userId === userId);

//   if(sort == "title") projects = projects.sort((a, b) => a.title.localeCompare(b.title));

//   const startIndex = (pageNumber - 1) * limitNumber;
//   const endIndex = startIndex + limitNumber;

//    projects = projects.slice(startIndex, endIndex);

//    return sendSuccess(res, 200, projects);
// };

export const getAllProjectsController = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    const projects = await getAllProjectsData(userId, page, limit);

    return sendSuccess(res, 200, projects);
};

export const getProjectByIdController = async (req, res) => {
    const projectId = Number(req.params.projectId);

    const project = await getProjectById(projectId);

    if (!project) {
        return sendError(res, 404, "Project not found");
    }

    return sendSuccess(res, 200, project);
};

export const createProjectController = async (req, res) => {
  const result = createProjectSchema.safeParse(req.body);

  if (!result.success) return sendError(res, 400,  "VALIDATION_ERROR","Invalid project data", formatValidationErrors(result.error.issues));

  const newProject = await createProject(result.data);

  return sendSuccess(res, 201, newProject);
};

export const updateProjectController = async (req,res) => {

    const projectId = Number(req.params.projectId);
    const result = updateProjectSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(res, 400, "VALIDATION_ERROR", "Invalid project data", formatValidationErrors(result.error.issues));
    }

    const updatedProject = await updateProject(projectId, result.data);

    if (!updatedProject) return sendError(res, 404, "Project not found");

    return sendSuccess(res, 200, updatedProject);
}

export const deleteProjectController = async (req, res) => {
    const projectId = Number(req.params.projectId);

    const deletedProject = await deleteProject(projectId);

    if (!deletedProject) return sendError(res, 404, "Project not found");

    return sendSuccess(res, 200, deletedProject);
};