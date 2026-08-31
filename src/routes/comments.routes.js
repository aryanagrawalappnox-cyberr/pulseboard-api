import express from "express";
import { getCommentsController, getCommentByIdController, createCommentController, updateCommentController, deleteCommentController } from "../controllers/comments.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, getCommentsController);
router.get("/:commentId", authMiddleware, getCommentByIdController);
router.post("/", authMiddleware, createCommentController);
router.put("/:commentId", authMiddleware, updateCommentController);
router.delete("/:commentId", authMiddleware, deleteCommentController);

export default router;