import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "10000"),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  isDev: process.env.NODE_ENV !== "production",
};

