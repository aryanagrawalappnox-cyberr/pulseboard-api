import express from "express";
import upload from "../middleware/upload.middleware.js";
import { createAttachmentController, getAttachmentsController, getAttachmentsByIdController, downloadAttachmentController, deleteAttachmentController} from "../controllers/attachments.controller.js";

const router = express.Router({
    mergeParams: true
});

router.post("/", upload.single("file"), createAttachmentController);
router.get("/", getAttachmentsController);
router.get("/:attachmentId", getAttachmentsByIdController);
router.get("/:attachmentId/download", downloadAttachmentController);
router.delete("/:attachmentId", deleteAttachmentController);

export default router;

