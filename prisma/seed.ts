import { PrismaClient } from "@prisma/client";
import { Status, Priority } from "../src/types";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Ahmed Hamdy", email: "ahmed@example.com" } }),
    prisma.user.create({ data: { name: "Sara Ali", email: "sara@example.com" } }),
    prisma.user.create({ data: { name: "Omar Hassan", email: "omar@example.com" } }),
    prisma.user.create({ data: { name: "Nour Mohamed", email: "nour@example.com" } }),
  ]);

  const statuses: Status[] = ["BACKLOG", "IN_PROGRESS", "BLOCKED", "DONE"];
  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const categories = ["Frontend", "Backend", "DevOps", "Design", "QA"];

  // Seed 30 tasks
  const tasks = [];
  for (let i = 1; i <= 30; i++) {
    const task = await prisma.task.create({
      data: {
        title: `Task ${i}: ${["Fix bug", "Implement feature", "Write tests", "Refactor module", "Deploy service"][i % 5]} #${i}`,
        description: `Detailed description for task ${i}. This covers all requirements.`,
        status: statuses[i % 4],
        priority: priorities[i % 4],
        category: categories[i % 5],
        dueDate: new Date(Date.now() + i * 86400000),
        assigneeId: users[i % users.length].id,
        archived: i > 28,
      },
    });
    tasks.push(task);
  }

  // Seed comments
  for (let i = 0; i < 20; i++) {
    await prisma.comment.create({
      data: {
        taskId: tasks[i % tasks.length].id,
        authorId: users[i % users.length].id,
        message: `Comment ${i + 1}: This is a meaningful comment on the task progress.`,
      },
    });
  }

  // Seed activity logs
  for (let i = 0; i < 40; i++) {
    const fields = ["status", "priority", "assigneeId"];
    const field = fields[i % 3];
    await prisma.activityLog.create({
      data: {
        taskId: tasks[i % tasks.length].id,
        userId: users[i % users.length].id,
        action: "UPDATED",
        field,
        oldValue: field === "status" ? statuses[(i + 1) % 4] : priorities[(i + 1) % 4],
        newValue: field === "status" ? statuses[i % 4] : priorities[i % 4],
      },
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());