import express from "express";
import {getAllProjects,getProjectByIdController, createProjectController, updateProjectController, deleteProjectController} from "../controllers/projects.controller.js";

const router = express.Router();

router.get("/", getAllProjects);

router.get("/:projectId", getProjectByIdController);

router.post("/", createProjectController);

router.put("/:projectId", updateProjectController);

router.delete("/:projectId", deleteProjectController);

export default router;