import pool from "../db.js";

export async function getProjectMembers(projectId) {
    const result = await pool.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            pm.role
         FROM project_members pm
         JOIN users u
            ON pm.user_id = u.id
         WHERE pm.project_id = $1
         ORDER BY u.id`,
        [projectId]
    );

    return result.rows;
}

export async function addProjectMember(projectId, userId, role) {
    const result = await pool.query(
        `INSERT INTO project_members (project_id, user_id, role)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [projectId, userId, role]
    );

    return result.rows[0];
}

export async function updateProjectMember(projectId, userId, role) {
    const result = await pool.query(
        `UPDATE project_members
         SET role = $1
         WHERE project_id = $2
           AND user_id = $3
         RETURNING *`,
        [role, projectId, userId]
    );

    return result.rows[0];
}

export async function deleteProjectMember(projectId, userId) {
    const result = await pool.query(
        `DELETE FROM project_members
         WHERE project_id = $1
           AND user_id = $2
         RETURNING *`,
        [projectId, userId]
    );

    return result.rows[0];
}