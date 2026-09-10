import { createAttachment, getAttachments, getAttachmentById, deleteAttachment} from "../data/attachments.data.js";
import { sendError, sendSuccess } from "../utils/response.js";
import path from "path";
import fs from "fs/promises";
import { uploadQueue } from "../queue.js";

export const createAttachmentController = async (req, res) => {
    const taskId = Number(req.params.taskId);

    if (!Number.isInteger(taskId) || taskId <= 0) {
        return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "Invalid task ID",
            []
        );
    }

    if (!req.file) {
        return sendError(res, 400, "FILE_REQUIRED", "Please upload a file");
    }

    const attachment = await createAttachment(
        taskId,
        req.file.originalname,
        req.file.path
    );

    await uploadQueue.add("processUpload", {
        attachmentId: attachment.id,
        taskId,
        fileName: req.file.originalname,
        filePath: req.file.path
    });

    return sendSuccess(res, 201, attachment);
};

export const getAttachmentsController = async (req, res) => {
    const taskId = Number(req.params.taskId);

    const attachments = await getAttachments(taskId);

    return sendSuccess(res, 200, attachments ?? []);
};

export const getAttachmentsByIdController = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const attachmentId = Number(req.params.attachmentId);

    const attachment = await getAttachmentById(taskId, attachmentId);
    if (!attachment) {
        return sendError(res, 404, "NOT_FOUND", "Attachment not found");
    }

    return sendSuccess(res, 200, attachment);
};

export const downloadAttachmentController = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const attachmentId = Number(req.params.attachmentId);

    const attachment = await getAttachmentById(taskId, attachmentId);

    if (!attachment) {
        return sendError(res, 404, "NOT_FOUND", "Attachment not found");
    }

    const filePath = path.resolve(attachment.file_url);

    // Files are stored under a generated UUID name; serve the original name to the client.
    return res.download(filePath, attachment.file_name);
};

export const deleteAttachmentController = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const attachmentId = Number(req.params.attachmentId);

    const attachment = await getAttachmentById(taskId, attachmentId);

    if (!attachment) {
        return sendError(res, 404, "NOT_FOUND", "Attachment not found");
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

    const deletedAttachment = await deleteAttachment(taskId, attachmentId);

    return sendSuccess(res, 200, deletedAttachment);
};