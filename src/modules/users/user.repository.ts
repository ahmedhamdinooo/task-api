import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userRepository = {
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { name: "asc" },
    });
  },
};