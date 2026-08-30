import prisma from "../prisma.js";

function isRecordNotFound(error) {
    return error.code === "P2025";
}

export async function createAttachment(taskId, fileName, fileUrl) {
    return await prisma.attachments.create({
        data: {
            file_name: fileName,
            file_url: fileUrl,
            task_id: taskId
        }
    });
}

export async function getAttachments(taskId) {
    return await prisma.attachments.findMany({
        where: {
            task_id: taskId
        },
        orderBy: {
            id: "asc"
        }
    });
}

export async function getAttachmentById(attachmentId) {
    return await prisma.attachments.findUnique({
        where: {
            id: attachmentId
        }
    });
}

export async function deleteAttachment(attachmentId) {
    try {
        return await prisma.attachments.delete({
            where: {
                id: attachmentId
            }
        });
    } catch (error) {
        if (isRecordNotFound(error)) return undefined;
        throw error;
    }
}
