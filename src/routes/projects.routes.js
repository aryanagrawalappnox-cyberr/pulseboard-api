import express from "express";
import {
  getAllProjects,
  getProjectByIdController,
  createProjectController,
} from "../controllers/projects.controller.js";

const router = express.Router();

router.get("/", getAllProjects);

router.get("/:projectId", getProjectByIdController);

router.post("/", createProjectController);

export default router;