import express from "express";
import { createUserController } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", createUserController);

export default router;