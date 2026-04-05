import Redis from "ioredis";
import { env } from "./env";

export const redis = new Redis(env.redisUrl, {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 0,
  retryStrategy: () => null,
});

let warned = false;
redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", () => {
  if (!warned) {
    console.warn("⚠️  Redis unavailable — using in-memory cache");
    warned = true; 
  }
});