import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../data/users.data.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { createUserSchema, updateUserSchema} from "../schemas/user.schema.js";
import { formatValidationErrors } from "../utils/validation.js";

export const createUserController = async (req, res) => {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(res, 400, "VALIDATION_ERROR", "Invalid user data", formatValidationErrors(result.error.issues));
    }
    const user = await createUser(result.data);

    return sendSuccess(res, 201, user);
};

export const getAllUsersController = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const users = await getAllUsers(page, limit);

    if(users == []) {
        return sendError(res, 404, "No users found");
    }   
    
    return sendSuccess(res, 200, users);
};

export const getUserByIdController = async (req, res) => {
    const userId = Number(req.params.userId);

    const user = await getUserById(userId);

    if (!user) {
        return sendError(res, 404, "User not found", formatValidationErrors([{ path: ["userId"], message: "User with the specified ID does not exist" }]));
    }
    
    return sendSuccess(res, 200, user);
};

export const updateUserController = async (req, res) => {
    const userId = Number(req.params.userId);
    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(res, 400, "VALIDATION_ERROR", "Invalid user data", formatValidationErrors(result.error.issues));
    }

    const updatedUser = await updateUser(userId, result.data);

    if (!updatedUser) {
        return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, updatedUser);
};

export const deleteUserController = async (req, res) => {
    const userId = Number(req.params.userId);
    const deletedUser = await deleteUser(userId);

    if (!deletedUser) {
        return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, deletedUser);
};