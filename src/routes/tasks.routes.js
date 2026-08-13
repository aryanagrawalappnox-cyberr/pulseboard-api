import express from "express";
import { getProjectTasksController, createProjectTaskController, getProjectTasksByIdController, updateProjectTaskController, deleteProjectTaskController} from "../controllers/tasks.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", getProjectTasksController);
router.get("/:taskId", getProjectTasksByIdController);
router.post("/", createProjectTaskController);
router.put("/:taskId", updateProjectTaskController);
router.delete("/:taskId", deleteProjectTaskController);

export default router;