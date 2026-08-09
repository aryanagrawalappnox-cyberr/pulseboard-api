import { z } from "zod";

export const createProjectSchema = z.object({
    userId : z.number().int().positive(),
    title : z.string().min(1, "Title is required").max(100),
    description : z.string().min(1, "Description is required").max(500),
})