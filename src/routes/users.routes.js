import express from "express";
import { createUserController, getAllUsersController, getUserByIdController, updateUserController, deleteUserController } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", createUserController);
router.get("/", getAllUsersController);
router.get("/:userId", getUserByIdController);
router .put("/:userId", updateUserController);
router.delete("/:userId", deleteUserController);

export default router;