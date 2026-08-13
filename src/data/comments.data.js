import pool from "../db.js";

export const getAllComments = async (taskId) => { 

    const result = await pool.query(
        `SELECT
            c.id,
            c.content,
            c.task_id,  
            c.created_at,
            u.id AS created_by,
            u.name AS created_by_name,
            u.email AS created_by_email
          FROM comments c
          JOIN users u
            ON c.created_by = u.id
          WHERE c.task_id = $1
          ORDER BY c.id`,
        [taskId]
    );  
    return result.rows;
};

export const getCommentById = async (taskId, commentId) => {
    const result = await pool.query(
        `SELECT 
            c.id,
            c.content,
            c.task_id,
            c.created_at,
            u.id AS created_by,
            u.name AS created_by_name,
            u.email AS created_by_email
         FROM comments c
         JOIN users u 
            ON c.created_by = u.id  
        WHERE c.task_id = $1 AND c.id = $2`,
        [taskId, commentId]
    );    

    return result.rows[0];
};

export const createComment = async (taskId, commentData) => {
    const { content, userId } = commentData;

    const result = await pool.query(  

        `INSERT INTO comments
            (content, task_id, created_by)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [content, taskId, userId]
    );    

    return result.rows[0];
};

export const updateComment = async (commentId, commentData) => {
    const { content } = commentData;

    const result = await pool.query(
        `UPDATE comments
          SET content = $1
          WHERE id = $2
          RETURNING *`,
        [content, commentId]
    );


    return result.rows[0];
};

export const deleteComment = async (commentId) => {
    const result = await pool.query(
        `DELETE FROM comments
         WHERE id = $1
         RETURNING *`,
        [commentId]
    );

    return result.rows[0];
};

