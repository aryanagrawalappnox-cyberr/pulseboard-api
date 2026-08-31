import express from "express";
import { getAllUsersController, getUserByIdController, updateUserController, deleteUserController } from "../controllers/users.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userOwnershipMiddleware } from "../middleware/user.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsersController);
router.get("/:userId", authMiddleware, getUserByIdController);
router.put("/:userId", authMiddleware, userOwnershipMiddleware, updateUserController);
router.delete("/:userId", authMiddleware, userOwnershipMiddleware, deleteUserController);

export default router;