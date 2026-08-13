import { sendError, sendSuccess } from "../utils/response.js";
import { createCommentSchema, updateCommentSchema } from "../schemas/comment.schema.js";
import { formatValidationErrors } from "../utils/validation.js";
import { getAllComments, getCommentById, createComment, updateComment, deleteComment } from "../data/comments.data.js";

export const getCommentsController = async (req, res) => {
    const taskId = Number(req.params.taskId);

    const comments = await getAllComments(taskId);

    return sendSuccess(res, 200, comments);
}

export const getCommentByIdController = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const commentId = Number(req.params.commentId); 

    const comment = await getCommentById(taskId, commentId);

    if (!comment) {
        return sendError(res, 404, "Comment not found", formatValidationErrors([{ path: ["commentId"], message: "Comment with the specified ID does not exist" }]));
    }

    return sendSuccess(res, 200, comment);
}

export const createCommentController = async (req, res) => {
    const taskId = Number(req.params.taskId);

    const result = createCommentSchema.safeParse(req.body);

    if (!result.success) {

        return sendError(res, 400, "VALIDATION_ERROR", "Invalid comment data", formatValidationErrors(result.error.issues));
    }

    const comment = await createComment(taskId, result.data);

    return sendSuccess(res, 201, comment);
}


export const updateCommentController = async (req, res) => {
    const commentId = Number(req.params.commentId);

    const result = updateCommentSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(res, 400, "VALIDATION_ERROR", "Invalid comment data", formatValidationErrors(result.error.issues));
    }

    const updatedComment = await updateComment(commentId, result.data);

    if (!updatedComment) {
        return sendError(res, 404, "Comment not found");
    }

    return sendSuccess(res, 200, updatedComment);
}

export const deleteCommentController = async (req, res) => {
    const commentId = Number(req.params.commentId);

    const deletedComment = await deleteComment(commentId);

    if (!deletedComment) {
        return sendError(res, 404, "Comment not found");
    }

    return sendSuccess(res, 200, deletedComment);
}