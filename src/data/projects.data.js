import pool from "../db.js";
import prisma from "../prisma.js";

export async function getAllProjectsData(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    return await prisma.projects.findMany({
        where: userId
            ? {
                owner_id: userId
            }
            : undefined,

        orderBy: {
            id: "asc"
        },

        skip: offset,
        take: limit
    });
}

export async function getProjectById(projectId) {
    return await prisma.projects.findUnique({
        where: {
            id: projectId
        }
    });
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

export async function createProject(projectData) {
    const { title, description, userId } = projectData;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const projectResult = await client.query(
            `INSERT INTO projects (title, description, owner_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [title, description, userId]
        );

        const project = projectResult.rows[0];

        await client.query(
            `INSERT INTO project_members (user_id, project_id, role)
             VALUES ($1, $2, $3)`,
            [userId, project.id, "Admin"]
        );

        await client.query("COMMIT");

        return project;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
}