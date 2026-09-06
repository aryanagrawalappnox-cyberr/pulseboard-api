/*
 * Domain constants mirrored from the API's database CHECK constraints.
 * Sending anything else results in a 500 from Postgres, so these strings are
 * the only values the UI is allowed to send.
 */

// migrations/004_create_tasks.sql
export const TASK_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const TASK_STATUS_LIST = [
  TASK_STATUS.PENDING,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.COMPLETED,
];

// migrations/003_create_project_members.sql
export const PROJECT_ROLE = {
  ADMIN: "Admin",
  MEMBER: "Member",
};

export const PROJECT_ROLE_LIST = [PROJECT_ROLE.ADMIN, PROJECT_ROLE.MEMBER];

// src/middleware/upload.middleware.js
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ACCEPTED_FILE_HINT = "JPG, PNG, PDF, DOC or DOCX, up to 5 MB";

export const STORAGE_KEY = "pulseboard.token";

// GET /projects and GET /users are paginated but return no total count, so the
// UI infers "there is a next page" from a full page of results.
export const PAGE_SIZE = 12;
