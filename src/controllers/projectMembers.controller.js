import { sendError, sendSuccess } from "../utils/response.js";
import { formatValidationErrors } from "../utils/validation.js";
import { getProjectMembers, addProjectMember, updateProjectMember, deleteProjectMember} from "../data/projectMembers.data.js";
import { createProjectMemberSchema, updateProjectMemberSchema } from "../schemas/projectMember.schema.js";


export const getProjectMembersController = async (req, res) => {
    const projectId = Number(req.params.projectId);

    const members = await getProjectMembers(projectId);

    return sendSuccess(res, 200, members);
};

export const addProjectMemberController = async (req, res) => {
    const projectId = Number(req.params.projectId);

    if (!Number.isInteger(projectId) || projectId <= 0) {
    return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid project ID",
        []
    );
}

    const result = createProjectMemberSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(res, 400, "VALIDATION_ERROR", "Invalid project member data", formatValidationErrors(result.error.issues));
    }
    const { userId, role } = result.data;

    if (!Number.isInteger(userId) || userId <= 0) {
    return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid user ID",
        []
    );
}

    const member = await addProjectMember(
        projectId,
        userId,
        role
    );

    if (!member) {
    return sendError(
        res,
        409,
        "ALREADY_MEMBER",
        "User is already a member of this project"
    );
}

    return sendSuccess(res, 201, member);
};

export const updateProjectMemberController = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const userId = Number(req.params.userId);

    if (
    !Number.isInteger(projectId) ||
    projectId <= 0 ||
    !Number.isInteger(userId) ||
    userId <= 0
) {
    return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid project or user ID",
        []
    );
}

    const result = updateProjectMemberSchema.safeParse(req.body);

    if (!result.success) {
        return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "Invalid project member data",
            formatValidationErrors(result.error.issues)
        );
    }

    const updatedMember = await updateProjectMember(
        projectId,
        userId,
        result.data.role
    );

    if (!updatedMember) {
        return sendError(res, 404, "Project member not found");
    }

    return sendSuccess(res, 200, updatedMember);
};

export const deleteProjectMemberController = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const userId = Number(req.params.userId);

    if (
    !Number.isInteger(projectId) ||
    projectId <= 0 ||
    !Number.isInteger(userId) ||
    userId <= 0
) {
    return sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid project or user ID",
        []
    );
}

    const deletedMember = await deleteProjectMember(
        projectId,
        userId
    );

    if (!deletedMember) {
        return sendError(res, 404, "Project member not found");
    }

    return sendSuccess(res, 200, deletedMember);
};