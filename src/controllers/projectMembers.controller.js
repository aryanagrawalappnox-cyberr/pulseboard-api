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

    const member = await addProjectMember(
        projectId,
        userId,
        role
    );

    return sendSuccess(res, 201, member);
};

export const updateProjectMemberController = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const userId = Number(req.params.userId);

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

    const deletedMember = await deleteProjectMember(
        projectId,
        userId
    );

    if (!deletedMember) {
        return sendError(res, 404, "Project member not found");
    }

    return sendSuccess(res, 200, deletedMember);
};