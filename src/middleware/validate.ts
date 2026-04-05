import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body); // throws ZodError caught by errorHandler
    next();
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query) as typeof req.query;
    next();
  };