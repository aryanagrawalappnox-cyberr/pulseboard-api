import express from "express";
import {
  getProjectMembersController,
  addProjectMemberController,
  updateProjectMemberController,
  deleteProjectMemberController,
} from "../controllers/projectMembers.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { projectRoleMiddleware } from "../middleware/projectRole.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, projectRoleMiddleware(["Admin", "Member"]), getProjectMembersController);
router.post("/", authMiddleware, projectRoleMiddleware(["Admin"]), addProjectMemberController);
router.put("/:userId", authMiddleware, projectRoleMiddleware(["Admin"]), updateProjectMemberController);
router.delete("/:userId", authMiddleware, projectRoleMiddleware(["Admin"]), deleteProjectMemberController);

export default router;
