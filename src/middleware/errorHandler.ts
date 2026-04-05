import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      data: null,
      meta: null,
      error: {
        message: "Validation failed",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
    });
  }

  // Known app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      data: null,
      meta: null,
      error: { message: err.message, details: null },
    });
  }

  // Unknown errors — never leak internals in production
  console.error("Unhandled error:", err);
  return res.status(500).json({
    data: null,
    meta: null,
    error: {
      message: "Internal server error",
      details: env.isDev ? err.message : null,
    },
  });
};