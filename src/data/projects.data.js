import prisma from "../prisma.js";

function isRecordNotFound(error) {
    return error.code === "P2025";
}

export async function getAllProjectsData(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    return await prisma.projects.findMany({
        where: {
            project_members: {
                some: {
                    user_id: userId
                }
            }
        },

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

    try {
        return await prisma.projects.update({
            where: {
                id: projectId
            },
            data: {
                title,
                description
            }
        });
    } catch (error) {
        if (isRecordNotFound(error)) return undefined;
        throw error;
    }
}

export async function deleteProject(projectId) {
    try {
        return await prisma.projects.delete({
            where: {
                id: projectId
            }
        });
    } catch (error) {
        if (isRecordNotFound(error)) return undefined;
        throw error;
    }
}

export async function createProject(projectData) {
    const { title, description, userId } = projectData;

    const project = await prisma.$transaction(async (tx) => {

        // 1. Create project
        const newProject = await tx.projects.create({
            data: {
                title,
                description,
                owner_id: userId
            }
        });

        // 2. Add owner as project member
        await tx.project_members.create({
            data: {
                user_id: userId,
                project_id: newProject.id,
                role: "Admin"
            }
        });

        // 3. Both operations succeeded
        return newProject;
    });

    return project;
}
