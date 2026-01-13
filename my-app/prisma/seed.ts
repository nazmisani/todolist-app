import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
  connectionString,
  password: process.env.DATABASE_URL?.match(/:(.*?)@/)?.[1] || "postgres",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create 4 users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        name: "John Doe",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        name: "Jane Smith",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        name: "Bob Wilson",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: "alice@example.com",
        name: "Alice Johnson",
        password: hashedPassword,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create 5 categories (distributed across users)
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Work",
        userId: users[0].id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Personal",
        userId: users[0].id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Shopping",
        userId: users[1].id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Health",
        userId: users[2].id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Learning",
        userId: users[3].id,
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create 15 todos (distributed across users and categories)
  const todos = await Promise.all([
    // User 1 todos
    prisma.todo.create({
      data: {
        title: "Complete project proposal",
        description: "Write and submit the Q1 project proposal",
        completed: false,
        priority: "high",
        dueDate: new Date("2026-01-20"),
        userId: users[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Review pull requests",
        description: "Check and review team's pull requests",
        completed: true,
        priority: "medium",
        dueDate: new Date("2026-01-15"),
        userId: users[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Buy groceries",
        description: "Get milk, eggs, bread, and vegetables",
        completed: false,
        priority: "medium",
        userId: users[0].id,
        categoryId: categories[1].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Call dentist",
        description: "Schedule annual checkup appointment",
        completed: false,
        priority: "low",
        dueDate: new Date("2026-01-18"),
        userId: users[0].id,
        categoryId: categories[1].id,
      },
    }),

    // User 2 todos
    prisma.todo.create({
      data: {
        title: "Buy new laptop",
        description: "Research and purchase new work laptop",
        completed: false,
        priority: "high",
        dueDate: new Date("2026-01-25"),
        userId: users[1].id,
        categoryId: categories[2].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Order office supplies",
        description: "Pens, notebooks, and sticky notes",
        completed: true,
        priority: "low",
        userId: users[1].id,
        categoryId: categories[2].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Prepare presentation",
        description: "Create slides for client meeting",
        completed: false,
        priority: "high",
        dueDate: new Date("2026-01-16"),
        userId: users[1].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Update documentation",
        description: "Update API documentation with new endpoints",
        completed: false,
        priority: "medium",
        userId: users[1].id,
      },
    }),

    // User 3 todos
    prisma.todo.create({
      data: {
        title: "Morning workout",
        description: "30 minutes cardio and stretching",
        completed: true,
        priority: "medium",
        userId: users[2].id,
        categoryId: categories[3].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Doctor appointment",
        description: "Annual physical examination",
        completed: false,
        priority: "high",
        dueDate: new Date("2026-01-22"),
        userId: users[2].id,
        categoryId: categories[3].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Meal prep for week",
        description: "Prepare healthy meals for the upcoming week",
        completed: false,
        priority: "medium",
        dueDate: new Date("2026-01-14"),
        userId: users[2].id,
        categoryId: categories[3].id,
      },
    }),

    // User 4 todos
    prisma.todo.create({
      data: {
        title: "Complete React course",
        description: "Finish remaining 5 modules on Udemy",
        completed: false,
        priority: "medium",
        dueDate: new Date("2026-01-30"),
        userId: users[3].id,
        categoryId: categories[4].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Read TypeScript book",
        description: "Read chapters 5-8 of TypeScript handbook",
        completed: true,
        priority: "low",
        userId: users[3].id,
        categoryId: categories[4].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Practice coding challenges",
        description: "Solve 3 LeetCode problems daily",
        completed: false,
        priority: "high",
        userId: users[3].id,
        categoryId: categories[4].id,
      },
    }),
    prisma.todo.create({
      data: {
        title: "Build side project",
        description: "Start working on portfolio website redesign",
        completed: false,
        priority: "medium",
        dueDate: new Date("2026-02-01"),
        userId: users[3].id,
        categoryId: categories[4].id,
      },
    }),
  ]);

  console.log(`Created ${todos.length} todos`);
  console.log("Seed completed successfully!");
  console.log("\nTest credentials:");
  console.log("- john@example.com / password123");
  console.log("- jane@example.com / password123");
  console.log("- bob@example.com / password123");
  console.log("- alice@example.com / password123");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
