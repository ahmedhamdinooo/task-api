import rateLimit from "express-rate-limit";
import { env } from "../config/env";

// Fixed window strategy
export const rateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs, // default: 1 minute
  max: env.rateLimitMax,           // default: 100 requests/window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    meta: null,
    error: { message: "Too many requests. Please slow down.", details: null },
  },
});