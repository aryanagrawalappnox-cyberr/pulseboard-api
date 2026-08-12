import express from "express";
import { getProjectTasksController, createProjectTaskController } from "../controllers/tasks.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", getProjectTasksController);
router.post("/", createProjectTaskController);

export default router;