import { taskRepository } from "./task.repository";
import { activityRepository } from "../activity/activity.repository";
import { cacheService } from "../../cache/cache.service";
import { emitTaskUpdated } from "../../socket/socket.service";
import { AppError } from "../../middleware/errorHandler";
import { parsePagination, TaskFilterQuery } from "../../types";
import { Status, Priority } from "../../types";

const TASKS_CACHE_PREFIX = "tasks:";
const USERS_CACHE_KEY = "users:all";

// A stable cache key based on query params
const buildTasksCacheKey = (query: TaskFilterQuery) =>
  `${TASKS_CACHE_PREFIX}${JSON.stringify(query)}`;

// Fields we auto-track in activity log
const TRACKED_FIELDS = ["status", "priority", "assigneeId"] as const;

export const taskService = {
  async listTasks(query: TaskFilterQuery) {
    const cacheKey = buildTasksCacheKey(query);
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const { page, limit, skip } = parsePagination(query);
    const { tasks, total } = await taskRepository.findMany({
      skip,
      take: limit,
      status: query.status as Status | undefined,
      priority: query.priority as Priority | undefined,
      assigneeId: query.assigneeId,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    const result: { data: typeof tasks; meta: { page: number; limit: number; total: number; totalPages: number } } = {
  data: tasks,
  meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
};

await cacheService.set(cacheKey, result, 30);
return result;
  },

  async getTask(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError("Task not found", 404);
    return task;
  },

async createTask(data: Parameters<typeof taskRepository.create>[0], userId: string) {
  try {
    const task = await taskRepository.create(data);
    await activityRepository.logCreated(task.id, userId);
    await cacheService.invalidatePattern(`${TASKS_CACHE_PREFIX}*`);
    emitTaskUpdated(task);
    return task;
  } catch (err) {
    console.error("❌ Error creating task:", err); // اطبع الخطأ في السيرفر
    throw err; // خلي الخطأ يرجع علشان middleware يقدر يديه للـ response
  }
},

  async updateTask(
    id: string,
    data: Parameters<typeof taskRepository.update>[1],
    userId: string
  ) {
    const existing = await taskRepository.findById(id);
    if (!existing) throw new AppError("Task not found", 404);

    const updated = await taskRepository.update(id, data);

    // Auto-log tracked field changes
    for (const field of TRACKED_FIELDS) {
      const oldVal = String(existing[field] ?? "");
      const newVal = String((data as Record<string, unknown>)[field] ?? existing[field] ?? "");
      if ((data as Record<string, unknown>)[field] !== undefined && oldVal !== newVal) {
        await activityRepository.logChange({
          taskId: id,
          userId,
          field,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    }

    await cacheService.invalidatePattern(`${TASKS_CACHE_PREFIX}*`);
    emitTaskUpdated(updated);
    return updated;
  },

  async archiveTask(id: string) {
    const existing = await taskRepository.findById(id);
    if (!existing) throw new AppError("Task not found", 404);

    const archived = await taskRepository.archive(id);
    await cacheService.invalidatePattern(`${TASKS_CACHE_PREFIX}*`);
    emitTaskUpdated(archived);
    return archived;
  },
};