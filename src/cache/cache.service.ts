import { redis } from "../config/redis";

// In-memory fallback cache
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

const memGet = (key: string): string | null => {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return item.value;
};

const memSet = (key: string, value: string, ttlSeconds: number) => {
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
};

const memDel = (...keys: string[]) => {
  keys.forEach((k) => memoryCache.delete(k));
};

const memDelPattern = (pattern: string) => {
  const prefix = pattern.replace("*", "");
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) memoryCache.delete(key);
  }
};

// Check if Redis is available
let redisAvailable = false;
redis.on("connect", () => { redisAvailable = true; });
redis.on("error", () => { redisAvailable = false; });

const DEFAULT_TTL = 60;

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (redisAvailable) {
        const data = await redis.get(key);
        return data ? (JSON.parse(data) as T) : null;
      }
      const data = memGet(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (redisAvailable) {
        await redis.set(key, serialized, "EX", ttl);
      } else {
        memSet(key, serialized, ttl);
      }
    } catch {}
  },

  async del(...keys: string[]): Promise<void> {
    try {
      if (redisAvailable) {
        if (keys.length) await redis.del(...keys);
      } else {
        memDel(...keys);
      }
    } catch {}
  },

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      if (redisAvailable) {
        const keys = await redis.keys(pattern);
        if (keys.length) await redis.del(...keys);
      } else {
        memDelPattern(pattern);
      }
    } catch {}
  },
};
