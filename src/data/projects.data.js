import pool from "../db.js";

export async function getAllProjectsData(userId,page = 1,limit = 10) {
    const offset = (page - 1) * limit;

    let query = `
        SELECT *
        FROM projects
    `;

    const values = [];

    if (userId) {
        values.push(userId);
        query += ` WHERE owner_id = $${values.length}`;
    }

    values.push(limit);
    query += ` ORDER BY id LIMIT $${values.length}`;

    values.push(offset);
    query += ` OFFSET $${values.length}`;

    const result = await pool.query(query, values);

    return result.rows;
}

export async function getProjectById(projectId) {
    const result = await pool.query(
        "SELECT * FROM projects WHERE id = $1",
        [projectId]
    );

    return result.rows[0];
}

export async function createProject(projectData) {
    const { title, description, userId } = projectData;

    const result = await pool.query(
        `INSERT INTO projects (title, description, owner_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [title, description, userId]
    );

    return result.rows[0];
}

export async function updateProject(projectId, projectData) {
    const { title, description } = projectData;

    const result = await pool.query(
        `UPDATE projects
         SET title = $1,
             description = $2
         WHERE id = $3
         RETURNING *`,
        [title, description, projectId]
    );

    return result.rows[0];
}

export async function deleteProject(projectId) {
    const result = await pool.query(
        `DELETE FROM projects
         WHERE id = $1
         RETURNING *`,
        [projectId]
    );

    return result.rows[0];
}