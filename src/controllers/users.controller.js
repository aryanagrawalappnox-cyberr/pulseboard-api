import { createUser } from "../data/users.data.js";

export const createUserController = async (req, res) => {
    const { name, email } = req.body;

    const user = await createUser({ name, email });

    return res.status(201).json({
        success: true,
        data: user,
    });
};