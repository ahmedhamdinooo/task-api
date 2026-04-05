import { Request } from "express";

// Manual enums since SQLite doesn't support Prisma enums
export type Status = "BACKLOG" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface TaskFilterQuery extends PaginationQuery {
  status?: string;
  priority?: string;
  assigneeId?: string;
  search?: string;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const parsePagination = (query: PaginationQuery) => {
  const page = Math.max(1, parseInt(query.page || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10")));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};