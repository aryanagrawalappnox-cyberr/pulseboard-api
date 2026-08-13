import express from "express";
import upload from "../middleware/upload.middleware.js";
import { createAttachmentController } from "../controllers/attachments.controller.js";

const router = express.Router({
    mergeParams: true
});

router.post("/", upload.single("file"), createAttachmentController);

export default router;