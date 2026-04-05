import { Router } from "express";
import { taskController } from "./task.controller";
import { validateBody, validateQuery } from "../../middleware/validate";
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from "./task.validation";
import { commentController } from "../comments/comment.controller";
import { validateBody as vb } from "../../middleware/validate";
import { createCommentSchema } from "../comments/comment.validation";

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List tasks with filtering, sorting, pagination
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [BACKLOG, IN_PROGRESS, BLOCKED, DONE] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH, URGENT] }
 *       - in: query
 *         name: assigneeId
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, dueDate, priority] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated task list
 */
router.get("/", validateQuery(taskQuerySchema), taskController.listTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID with comments and activity log
 *     tags: [Tasks]
 */
router.get("/:id", taskController.getTask);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 */
router.post("/", validateBody(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Partially update a task (auto-logs changes)
 *     tags: [Tasks]
 */
router.patch("/:id", validateBody(updateTaskSchema), taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}/archive:
 *   patch:
 *     summary: Soft-archive a task
 *     tags: [Tasks]
 */
router.patch("/:id/archive", taskController.archiveTask);

/**
 * @swagger
 * /tasks/{id}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
 */
router.post("/:id/comments", vb(createCommentSchema), commentController.addComment);

export default router;