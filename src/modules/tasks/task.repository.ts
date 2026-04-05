import { PrismaClient, Prisma } from "@prisma/client";
import { Status, Priority } from "../../types";
const prisma = new PrismaClient();

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true } },
};

const taskFullInclude = {
  ...taskInclude,
  comments: {
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
  activityLogs: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
};

// Priority sort helper (SQLite doesn't support enum ordering natively)
const priorityOrder: Record<Priority, number> = {
  URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1,
};

export const taskRepository = {
  async findMany(params: {
    skip: number;
    take: number;
    status?: Status;
    priority?: Priority;
    assigneeId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const where: Prisma.TaskWhereInput = {
      archived: false,
      ...(params.status && { status: params.status }),
      ...(params.priority && { priority: params.priority }),
      ...(params.assigneeId && { assigneeId: params.assigneeId }),
      ...(params.search && {
        OR: [
          { title: { contains: params.search } },
          { description: { contains: params.search } },
        ],
      }),
    };

    const orderBy: Prisma.TaskOrderByWithRelationInput =
      params.sortBy === "dueDate"
        ? { dueDate: params.sortOrder || "asc" }
        : { createdAt: params.sortOrder || "desc" };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy,
        include: taskInclude,
      }),
      prisma.task.count({ where }),
    ]);

    // Client-side priority sort when sortBy=priority (SQLite limitation)
if (params.sortBy === "priority") {
  tasks.sort((a, b) => {
    const aPriority = a.priority as Priority;
    const bPriority = b.priority as Priority;
    return params.sortOrder === "asc"
      ? priorityOrder[aPriority] - priorityOrder[bPriority]
      : priorityOrder[bPriority] - priorityOrder[aPriority];
  });
}

    return { tasks, total };
  },

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id }, include: taskFullInclude });
  },

  async create(data: {
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    category?: string;
    dueDate?: string;
    assigneeId?: string;
  }) {
    return prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: taskInclude,
    });
  },

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    category: string;
    dueDate: string;
    assigneeId: string;
  }>) {
    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: taskInclude,
    });
  },

  async archive(id: string) {
    return prisma.task.update({
      where: { id },
      data: { archived: true },
      include: taskInclude,
    });
  },
};