import pool from "../db.js";

export async function createUser(userData) {
    const { name, email } = userData;

    const result = await pool.query(
        `INSERT INTO users (name, email)
         VALUES ($1, $2)
         RETURNING *`,
        [name, email]
    );

    return result.rows[0];
}

export async function getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT *
         FROM users
         ORDER BY id
         LIMIT $1
         OFFSET $2`,
        [limit, offset]
    );

    return result.rows;
}

export async function getUserById(userId) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    return result.rows[0];
}

export async function updateUser(userId, userData) {
    const { name, email } = userData;
    const result = await pool.query(
        `UPDATE users
         SET name = $1, email = $2
         WHERE id = $3
         RETURNING *`,
        [name, email, userId]
    );    

    return result.rows[0];
} 

export async function deleteUser(userId) {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId]);
    return result.rows[0];
}   
