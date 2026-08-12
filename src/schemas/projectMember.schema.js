import { z } from "zod";

export const createProjectMemberSchema = z.object({
    userId: z.number().int().positive(),
    role: z.string().min(1)
});

export const updateProjectMemberSchema = z.object({
    role: z.string().min(1)
});