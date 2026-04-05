import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  description: z.string().max(2000).trim().optional(),
  status: z.enum(["BACKLOG", "IN_PROGRESS", "BLOCKED", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().max(100).trim().optional(),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().cuid().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  status: z.enum(["BACKLOG", "IN_PROGRESS", "BLOCKED", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: z.string().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});