import express from "express";
import { sendSuccess, sendError } from "./utils/response.js";
import projectRoutes from "./routes/projects.routes.js";
import usersRoutes from "./routes/users.routes.js";
import projectMembersRoutes from "./routes/projectMembers.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import attachmentsRouter from "./routes/attachments.routes.js";

const app = express();

// Request Logging Middleware
app.use((req, res, next) => {
  const timeStamp = new Date();

  console.log(
    `[${timeStamp.toISOString()}] ${req.method} ${req.originalUrl}`
  );

  next();
});

// JSON Body Parser Middleware
app.use(express.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// Project Routes
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/projects/:projectId/members", projectMembersRoutes);
app.use("/api/v1/projects/:projectId/tasks", tasksRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/tasks/:taskId/comments", commentsRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/tasks/:taskId/attachments",attachmentsRouter);
app.use("/api/v1/attachments", attachmentsRouter);  

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);

  return sendError(res, 500, "INTERNAL_SERVER_ERROR", "An unexpected error occurred");
});

export default app;