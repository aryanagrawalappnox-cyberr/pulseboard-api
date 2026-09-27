import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]),
});
