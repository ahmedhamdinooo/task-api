import { Request, Response, NextFunction } from "express";
import { taskService } from "./task.service";
import { sendSuccess } from "../../utils/response";
import { TaskFilterQuery } from "../../types";

// Hardcode a fallback userId since there's no auth
const SYSTEM_USER_ID = "system";

export const taskController = {
  async listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await taskService.listTasks(req.query as TaskFilterQuery) as { data: unknown[]; meta: object };
    sendSuccess(res, result.data, result.meta);
  } catch (err) {
    next(err);
  }
},

  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getTask(req.params.id);
      sendSuccess(res, task);
    } catch (err) {
      next(err);
    }
  },

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.createTask(req.body, SYSTEM_USER_ID);
      sendSuccess(res, task, undefined, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body, SYSTEM_USER_ID);
      sendSuccess(res, task);
    } catch (err) {
      next(err);
    }
  },

  async archiveTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.archiveTask(req.params.id);
      sendSuccess(res, task);
    } catch (err) {
      next(err);
    }
  },
};