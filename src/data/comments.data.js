import prisma from "../prisma.js";

function isRecordNotFound(error) {
    return error.code === "P2025";
}

function formatComment(comment) {
    return {
        id: comment.id,
        content: comment.content,
        task_id: comment.task_id,
        created_at: comment.created_at,
        created_by: comment.users?.id ?? comment.created_by,
        created_by_name: comment.users?.name,
        created_by_email: comment.users?.email
    };
}

export const getAllComments = async (taskId) => { 

    const comments = await prisma.comments.findMany({
        where: {
            task_id: taskId,
            created_by: {
                not: null
            }
        },
        include: {
            users: true
        },
        orderBy: {
            id: "asc"
        }
    });

    return comments.map(formatComment);
};

export const getCommentById = async (taskId, commentId) => {
    const comment = await prisma.comments.findFirst({
        where: {
            task_id: taskId,
            id: commentId,
            created_by: {
                not: null
            }
        },
        include: {
            users: true
        }
    });

    return comment ? formatComment(comment) : undefined;
};

export const createComment = async (taskId, commentData) => {
    const { content, userId } = commentData;

    return await prisma.comments.create({
        data: {
            content,
            task_id: taskId,
            created_by: userId
        }
    });
};

export const updateComment = async (commentId, commentData) => {
    const { content } = commentData;

    try {
        return await prisma.comments.update({
            where: {
                id: commentId
            },
            data: {
                content
            }
        });
    } catch (error) {
        if (isRecordNotFound(error)) return undefined;
        throw error;
    }
};

export const deleteComment = async (commentId) => {
    try {
        return await prisma.comments.delete({
            where: {
                id: commentId
            }
        });
    } catch (error) {
        if (isRecordNotFound(error)) return undefined;
        throw error;
    }
};
