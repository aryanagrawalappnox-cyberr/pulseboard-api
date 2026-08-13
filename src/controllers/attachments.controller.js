import { createAttachment, getAttachments, getAttachmentById, deleteAttachment} from "../data/attachments.data.js";
import { sendError, sendSuccess } from "../utils/response.js";
import path from "path";
import fs from "fs/promises";

export const createAttachmentController = async (req, res) => {
    const taskId = Number(req.params.taskId);

    if (!req.file) {
        return sendError(res, 400, "FILE_REQUIRED", "Please upload a file");
    }

    const attachment = await createAttachment(
        taskId,
        req.file.originalname,
        req.file.path
    );

    return sendSuccess(res, 201, attachment);
};

export const getAttachmentsController = async (req, res) => {
    const taskId = Number(req.params.taskId);

    const attachments = await getAttachments(taskId);
    if (!attachments || attachments.length === 0) {
        return sendError(res, 404, "No attachments found for this task");
    }

    return sendSuccess(res, 200, attachments);
};

export const getAttachmentsByIdController = async (req, res) => {
    const attachmentId = Number(req.params.attachmentId);

    const attachment = await getAttachmentById(attachmentId);
    if (!attachment) {
        return sendError(res, 404, "Attachment not found");
    }

    return sendSuccess(res, 200, attachment);
};

export const downloadAttachmentController = async (req, res) => {
    const attachmentId = Number(req.params.attachmentId);

    const attachment = await getAttachmentById(attachmentId);

    if (!attachment) {
        return sendError(res, 404, "Attachment not found");
    }

    const filePath = path.resolve(attachment.file_url);

    return res.download(filePath);
};

export const deleteAttachmentController = async (req, res) => {
    const attachmentId = Number(req.params.attachmentId);

    const attachment = await getAttachmentById(attachmentId);

    if (!attachment) {
        return sendError(res, 404, "Attachment not found");
    }

    const filePath = path.resolve(attachment.file_url);

    try {
        await fs.unlink(filePath);
    } catch (error) {
        // File may already be missing.
        if (error.code !== "ENOENT") {
            throw error;
        }
    }

    const deletedAttachment = await deleteAttachment(attachmentId);

    return sendSuccess(res, 200, deletedAttachment);
};