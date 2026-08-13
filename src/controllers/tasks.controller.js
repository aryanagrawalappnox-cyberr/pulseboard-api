import { sendError, sendSuccess } from "../utils/response.js";
import { createTaskSchema, updateTaskSchema} from "../schemas/task.schema.js";
import { formatValidationErrors } from "../utils/validation.js";
import { getProjectTasks, getProjectTasksById, createProjectTasks, updateProjectTasks, deleteProjectTasks} from "../data/tasks.data.js";

export const getProjectTasksController = async (req, res) => {
    const projectId = Number(req.params.projectId);

    const tasks = await getProjectTasks(projectId);

    return sendSuccess(res, 200, tasks);
};

export const getProjectTasksByIdController = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const taskId = Number(req.params.taskId);

    const tasks = await getProjectTasksById(projectId, taskId);

    if (!tasks) {
        return sendError(res, 404, "Task not found", formatValidationErrors([{ path: ["taskId"], message: "Task with the specified ID does not exist" }]));
    }

    return sendSuccess(res, 200, tasks);
};

export const createProjectTaskController = async (req, res) => {
    const projectId = Number(req.params.projectId);

    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "Invalid task data",
            formatValidationErrors(result.error.issues)
        );
    }

    const task = await createProjectTasks(projectId, result.data);

    return sendSuccess(res, 201, task);
};

export const updateProjectTaskController = async (req, res) => {
    const taskId = Number(req.params.taskId);

    const result = updateTaskSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "Invalid task data",
            formatValidationErrors(result.error.issues)
        );
    }

    const updatedTask = await updateProjectTasks(taskId, result.data);   

    return sendSuccess(res, 200, updatedTask);  
};

export const deleteProjectTaskController = async (req, res) => {
    const taskId = Number(req.params.taskId);       

    const deletedTask = await deleteProjectTasks(taskId);

    if (!deletedTask) {
        return sendError(res, 404, "Task not found", formatValidationErrors([{ path: ["taskId"], message: "Task with the specified ID does not exist" }]));
    }

    return sendSuccess(res, 200, deletedTask);
};
