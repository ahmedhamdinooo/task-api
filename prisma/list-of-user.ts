import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
  });

  console.log("✅ Users in DB:");
  users.forEach((user) => {
    console.log(`${user.name} => id: ${user.id}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());