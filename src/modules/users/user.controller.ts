import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { sendSuccess } from "../../utils/response";

export const userController = {
  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.listUsers();
      sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  },
};