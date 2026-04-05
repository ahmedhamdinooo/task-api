import { Request, Response, NextFunction } from "express";
import { commentService } from "./comment.service";
import { sendSuccess } from "../../utils/response";

export const commentController = {
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.addComment(
        req.params.id,
        req.body.authorId,
        req.body.message
      );
      sendSuccess(res, comment, undefined, 201);
    } catch (err) {
      next(err);
    }
  },
};