import express from "express";
import {getAllProjectsController,getProjectByIdController, createProjectController, updateProjectController, deleteProjectController} from "../controllers/projects.controller.js";

const router = express.Router();

router.get("/", getAllProjectsController);
router.get("/:projectId", getProjectByIdController);
router.post("/", createProjectController);
router.put("/:projectId", updateProjectController);
router.delete("/:projectId", deleteProjectController);

export default router;