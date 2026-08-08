import express from "express";
import projectRoutes from "./routes/projects.routes.js";

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


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
});

export default app;