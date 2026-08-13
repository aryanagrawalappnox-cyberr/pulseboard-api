import express from "express";
import { getCommentsController, getCommentByIdController, createCommentController, updateCommentController, deleteCommentController } from "../controllers/comments.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", getCommentsController);
router.get("/:commentId", getCommentByIdController);
router.post("/", createCommentController);
router.put("/:commentId", updateCommentController);
router.delete("/:commentId", deleteCommentController);

export default router;