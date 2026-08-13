import pool from "../db.js";

export async function createAttachment(taskId, fileName, fileUrl) {
    const result = await pool.query(
        `INSERT INTO attachments (file_name, file_url, task_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [fileName, fileUrl, taskId]
    );

    return result.rows[0];
}

export async function getAttachments(taskId) {
    const result = await pool.query(
        `SELECT *
         FROM attachments
         WHERE task_id = $1
         ORDER BY id`,
        [taskId]
    );

    return result.rows;
}

export async function getAttachmentById(attachmentId) {
    const result = await pool.query(
        `SELECT *
         FROM attachments
         WHERE id = $1`,
        [attachmentId]
    );  

    return result.rows[0];
}

export async function deleteAttachment(attachmentId) {
    const result = await pool.query(
        `DELETE FROM attachments
         WHERE id = $1
         RETURNING *`,
        [attachmentId]
    );

    return result.rows[0];
}
