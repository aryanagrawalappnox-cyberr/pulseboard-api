import express from "express";
import { getCommentsController, getCommentByIdController, createCommentController, updateCommentController, deleteCommentController } from "../controllers/comments.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { projectRoleMiddleware } from "../middleware/projectRole.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, taskAccessMiddleware(["Admin", "Member"]), getCommentsController);
router.get("/:commentId", authMiddleware, taskAccessMiddleware(["Admin", "Member"]), getCommentByIdController);
router.post("/", authMiddleware, taskAccessMiddleware(["Admin", "Member"]), createCommentController);
router.put("/:commentId", authMiddleware, taskAccessMiddleware(["Admin", "Member"]), updateCommentController);
router.delete("/:commentId", authMiddleware, taskAccessMiddleware(["Admin", "Member"]), deleteCommentController);

export default router;