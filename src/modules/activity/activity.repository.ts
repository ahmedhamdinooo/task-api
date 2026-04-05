import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LogChangeParams {
  taskId: string;
  userId: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

export const activityRepository = {
  async logChange(params: LogChangeParams) {
    return prisma.activityLog.create({
      data: {
        taskId: params.taskId,
        userId: params.userId,
        action: "UPDATED",
        field: params.field,
        oldValue: params.oldValue,
        newValue: params.newValue,
      },
    });
  },

  async logCreated(taskId: string, userId: string) {
    return prisma.activityLog.create({
      data: { taskId, userId, action: "CREATED" },
    });
  },
};