import express from "express";
import { getProjectTasksController, createProjectTaskController, getProjectTasksByIdController, updateProjectTaskController, deleteProjectTaskController} from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, getProjectTasksController);
router.get("/:taskId", authMiddleware, getProjectTasksByIdController);
router.post("/", authMiddleware, createProjectTaskController);
router.put("/:taskId", authMiddleware, updateProjectTaskController);
router.delete("/:taskId", authMiddleware, deleteProjectTaskController);

export default router;