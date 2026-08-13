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