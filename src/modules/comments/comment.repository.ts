import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const commentRepository = {
  async create(taskId: string, authorId: string, message: string) {
    return prisma.comment.create({
      data: { taskId, authorId, message },
      include: { author: { select: { id: true, name: true } } },
    });
  },
};