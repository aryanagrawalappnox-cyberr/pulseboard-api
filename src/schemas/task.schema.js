import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    status: z.string().min(1),
    userId: z.number().int().positive()
});