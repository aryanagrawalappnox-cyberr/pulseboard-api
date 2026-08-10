import pool from "../db.js";

const users = [
  {
    id: 1,
    name: "Aryan Agrawal",
    email: "aryan@example.com",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@example.com",
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@example.com",
  },
];

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

