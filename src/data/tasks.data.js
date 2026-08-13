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

export async function getProjectTasksById(projectId, taskId) {
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
         WHERE t.project_id = $1 AND t.id = $2`,
        [projectId, taskId]
    );

    return result.rows[0];
}

export async function createProjectTasks(projectId, taskData) {
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

export async function updateProjectTasks(taskId, taskData) {
    const { title, description, status } = taskData;    

    const result = await pool.query(
        `UPDATE tasks
         SET title = $1, description = $2, status = $3
         WHERE id = $4
         RETURNING *`,
        [title, description, status, taskId]
    );  

    return result.rows[0];
}

export async function deleteProjectTasks(taskId) {
    const result = await pool.query(
        `DELETE FROM tasks
         WHERE id = $1
         RETURNING *`,
        [taskId]
    );
    return result.rows[0];
} 