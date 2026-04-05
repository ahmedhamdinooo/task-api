import { z } from "zod";

export const createCommentSchema = z.object({
  authorId: z.string().cuid("Invalid author ID"),
  message: z.string().min(1).max(2000).trim(),
});