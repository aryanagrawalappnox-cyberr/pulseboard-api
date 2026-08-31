import express from "express";
import upload from "../middleware/upload.middleware.js";
import { createAttachmentController, getAttachmentsController, getAttachmentsByIdController, downloadAttachmentController, deleteAttachmentController} from "../controllers/attachments.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router({
    mergeParams: true
});

router.post("/", authMiddleware, upload.single("file"), createAttachmentController);
router.get("/", authMiddleware, getAttachmentsController);
router.get("/:attachmentId", authMiddleware, getAttachmentsByIdController);
router.get("/:attachmentId/download", authMiddleware, downloadAttachmentController);
router.delete("/:attachmentId", authMiddleware, deleteAttachmentController);

export default router;

