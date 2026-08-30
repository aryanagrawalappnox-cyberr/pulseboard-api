import prisma from "../prisma.js";

function isRecordNotFound(error) {
    return error.code === "P2025";
}

export async function createUser(userData) {
    const { name, email } = userData;

    return await prisma.users.create({
        data: {
            name,
            email
        }
    });
}

export async function getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    return await prisma.users.findMany({
        orderBy: {
            id: "asc"
        },
        skip: offset,
        take: limit
    });
}

export async function getUserById(userId) {
    return await prisma.users.findUnique({
        where: {
            id: userId
        }
    });
}

export async function updateUser(userId, userData) {
    const { name, email } = userData;

    try {
        return await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                name,
                email
            }
        });
    } catch (error) {
        if (isRecordNotFound(error)) return undefined;
        throw error;
    }
} 

export async function deleteUser(userId) {
    try {
        return await prisma.users.delete({
            where: {
                id: userId
            }
        });
    } catch (error) {
        if (isRecordNotFound(error)) return undefined;
        throw error;
    }
}   
