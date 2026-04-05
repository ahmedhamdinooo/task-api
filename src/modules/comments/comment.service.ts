import { commentRepository } from "./comment.repository";
import { taskRepository } from "../tasks/task.repository";
import { emitCommentCreated } from "../../socket/socket.service";
import { AppError } from "../../middleware/errorHandler";

export const commentService = {
  async addComment(taskId: string, authorId: string, message: string) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    const comment = await commentRepository.create(taskId, authorId, message);
    emitCommentCreated(comment);
    return comment;
  },
};