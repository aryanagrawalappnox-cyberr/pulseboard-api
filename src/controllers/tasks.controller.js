import { sendError, sendSuccess } from "../utils/response.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { formatValidationErrors } from "../utils/validation.js";
import { getProjectTasks, createProjectTask } from "../data/tasks.data.js";

export const getProjectTasksController = async (req, res) => {
    const projectId = Number(req.params.projectId);

    const tasks = await getProjectTasks(projectId);

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

    const task = await createProjectTask(projectId, result.data);

    return sendSuccess(res, 201, task);
};