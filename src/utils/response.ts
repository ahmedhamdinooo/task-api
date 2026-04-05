import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  meta?: object,
  status = 200
) => {
  res.status(status).json({ data, meta: meta ?? null, error: null });
};

export const sendError = (
  res: Response,
  message: string,
  status = 400,
  details?: unknown
) => {
  res.status(status).json({ data: null, meta: null, error: { message, details: details ?? null } });
};