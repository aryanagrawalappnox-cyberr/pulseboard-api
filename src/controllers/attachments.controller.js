import { createAttachment } from "../data/attachments.data.js";
import { sendError, sendSuccess } from "../utils/response.js";

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