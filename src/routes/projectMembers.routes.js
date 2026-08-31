import express from "express";
import { getProjectMembersController, addProjectMemberController, updateProjectMemberController, deleteProjectMemberController} from "../controllers/projectMembers.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, getProjectMembersController);
router.post("/", authMiddleware, addProjectMemberController);
router.put("/:userId", authMiddleware, updateProjectMemberController);
router.delete("/:userId", authMiddleware, deleteProjectMemberController);

export default router;