import pool from "../db.js";

export async function getProjectTasks(projectId) {
    const result = await pool.query(
        `SELECT
            t.id,
            t.title,
            t.description,
            t.status,
            t.project_id,
            t.created_at,
            u.id AS created_by,
            u.name AS created_by_name,
            u.email AS created_by_email
         FROM tasks t
         JOIN users u
           ON t.created_by = u.id
         WHERE t.project_id = $1
         ORDER BY t.id`,
        [projectId]
    );

    return result.rows;
}

export async function createProjectTask(projectId, taskData) {
     const { title, description, status, userId } = taskData;

    const result = await pool.query(
        `INSERT INTO tasks
            (title, description, status, project_id, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, description, status, projectId, userId]
    );

    return result.rows[0];
}