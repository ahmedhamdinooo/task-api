import { userRepository } from "./user.repository";
import { cacheService } from "../../cache/cache.service";

const USERS_CACHE_KEY = "users:all";

export const userService = {
  async listUsers() {
    const cached = await cacheService.get(USERS_CACHE_KEY);
    if (cached) return cached;

    const users = await userRepository.findAll();
    await cacheService.set(USERS_CACHE_KEY, users, 120); // cache 2 min
    return users;
  },
};