import express from "express";
import { getProjectMembersController, addProjectMemberController, updateProjectMemberController, deleteProjectMemberController} from "../controllers/projectMembers.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", getProjectMembersController);
router.post("/", addProjectMemberController);
router.put("/:userId", updateProjectMemberController);
router.delete("/:userId", deleteProjectMemberController);

export default router;