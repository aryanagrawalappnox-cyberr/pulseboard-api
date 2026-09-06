import express from "express";
import { getProjectTasksController, createProjectTaskController, getProjectTasksByIdController, updateProjectTaskController, deleteProjectTaskController} from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { projectRoleMiddleware } from "../middleware/projectRole.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, projectRoleMiddleware(["Admin", "Member"]), getProjectTasksController);
router.get("/:taskId", authMiddleware, projectRoleMiddleware(["Admin", "Member"]), getProjectTasksByIdController);
router.post("/", authMiddleware, projectRoleMiddleware(["Admin", "Member"]), createProjectTaskController);
router.put("/:taskId", authMiddleware, projectRoleMiddleware(["Admin", "Member"]), updateProjectTaskController);
router.delete("/:taskId", authMiddleware, projectRoleMiddleware(["Admin", "Member"]), deleteProjectTaskController);

export default router;