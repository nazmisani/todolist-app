import { PrismaClient, Priority } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Database setup
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
  connectionString,
  password: process.env.DATABASE_URL?.match(/:(.*?)@/)?.[1] || "postgres",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Types
type UserData = {
  email: string;
  name: string;
};

type CategoryData = {
  name: string;
  userIndex: number;
};

type TodoData = {
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  userIndex: number;
  categoryIndex?: number;
};

// Seed Data Constants
const USERS_DATA: UserData[] = [
  { email: "john@example.com", name: "John Doe" },
  { email: "jane@example.com", name: "Jane Smith" },
  { email: "bob@example.com", name: "Bob Wilson" },
  { email: "alice@example.com", name: "Alice Johnson" },
];

const CATEGORIES_DATA: CategoryData[] = [
  { name: "Work", userIndex: 0 },
  { name: "Personal", userIndex: 0 },
  { name: "Shopping", userIndex: 1 },
  { name: "Health", userIndex: 2 },
  { name: "Learning", userIndex: 3 },
];

const TODOS_DATA: TodoData[] = [
  // John's todos (User 0)
  {
    title: "Complete project proposal",
    description: "Write and submit the Q1 project proposal",
    completed: false,
    priority: Priority.high,
    dueDate: new Date("2026-01-20"),
    userIndex: 0,
    categoryIndex: 0,
  },
  {
    title: "Review pull requests",
    description: "Check and review team's pull requests",
    completed: true,
    priority: Priority.medium,
    dueDate: new Date("2026-01-15"),
    userIndex: 0,
    categoryIndex: 0,
  },
  {
    title: "Buy groceries",
    description: "Get milk, eggs, bread, and vegetables",
    completed: false,
    priority: Priority.medium,
    userIndex: 0,
    categoryIndex: 1,
  },
  {
    title: "Call dentist",
    description: "Schedule annual checkup appointment",
    completed: false,
    priority: Priority.low,
    dueDate: new Date("2026-01-18"),
    userIndex: 0,
    categoryIndex: 1,
  },
  // Jane's todos (User 1)
  {
    title: "Buy new laptop",
    description: "Research and purchase new work laptop",
    completed: false,
    priority: Priority.high,
    dueDate: new Date("2026-01-25"),
    userIndex: 1,
    categoryIndex: 2,
  },
  {
    title: "Order office supplies",
    description: "Pens, notebooks, and sticky notes",
    completed: true,
    priority: Priority.low,
    userIndex: 1,
    categoryIndex: 2,
  },
  {
    title: "Prepare presentation",
    description: "Create slides for client meeting",
    completed: false,
    priority: Priority.high,
    dueDate: new Date("2026-01-16"),
    userIndex: 1,
  },
  {
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    completed: false,
    priority: Priority.medium,
    userIndex: 1,
  },
  // Bob's todos (User 2)
  {
    title: "Morning workout",
    description: "30 minutes cardio and stretching",
    completed: true,
    priority: Priority.medium,
    userIndex: 2,
    categoryIndex: 3,
  },
  {
    title: "Doctor appointment",
    description: "Annual physical examination",
    completed: false,
    priority: Priority.high,
    dueDate: new Date("2026-01-22"),
    userIndex: 2,
    categoryIndex: 3,
  },
  {
    title: "Meal prep for week",
    description: "Prepare healthy meals for the upcoming week",
    completed: false,
    priority: Priority.medium,
    dueDate: new Date("2026-01-14"),
    userIndex: 2,
    categoryIndex: 3,
  },
  // Alice's todos (User 3)
  {
    title: "Complete React course",
    description: "Finish remaining 5 modules on Udemy",
    completed: false,
    priority: Priority.medium,
    dueDate: new Date("2026-01-30"),
    userIndex: 3,
    categoryIndex: 4,
  },
  {
    title: "Read TypeScript book",
    description: "Read chapters 5-8 of TypeScript handbook",
    completed: true,
    priority: Priority.low,
    userIndex: 3,
    categoryIndex: 4,
  },
  {
    title: "Practice coding challenges",
    description: "Solve 3 LeetCode problems daily",
    completed: false,
    priority: Priority.high,
    userIndex: 3,
    categoryIndex: 4,
  },
  {
    title: "Build side project",
    description: "Start working on portfolio website redesign",
    completed: false,
    priority: Priority.medium,
    dueDate: new Date("2026-02-01"),
    userIndex: 3,
    categoryIndex: 4,
  },
];

const DEFAULT_PASSWORD = "password123";

// Helper Functions
async function cleanDatabase() {
  console.log("🧹 Cleaning existing data...");

  try {
    await prisma.todo.deleteMany();
    console.log("  ✓ Deleted all todos");

    await prisma.category.deleteMany();
    console.log("  ✓ Deleted all categories");

    await prisma.user.deleteMany();
    console.log("  ✓ Deleted all users");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
    throw error;
  }
}

async function seedUsers() {
  console.log("\n👥 Creating users...");

  try {
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const users = await Promise.all(
      USERS_DATA.map((userData) =>
        prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
          },
        })
      )
    );

    console.log(`  ✓ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error("❌ Error creating users:", error);
    throw error;
  }
}

async function seedCategories(users: { id: string }[]) {
  console.log("\n📁 Creating categories...");

  try {
    const categories = await Promise.all(
      CATEGORIES_DATA.map((categoryData) =>
        prisma.category.create({
          data: {
            name: categoryData.name,
            userId: users[categoryData.userIndex].id,
          },
        })
      )
    );

    console.log(`  ✓ Created ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error("❌ Error creating categories:", error);
    throw error;
  }
}

async function seedTodos(
  users: { id: string }[],
  categories: { id: string }[]
) {
  console.log("\n📝 Creating todos...");

  try {
    const todos = await Promise.all(
      TODOS_DATA.map((todoData) =>
        prisma.todo.create({
          data: {
            title: todoData.title,
            description: todoData.description,
            completed: todoData.completed,
            priority: todoData.priority,
            dueDate: todoData.dueDate,
            userId: users[todoData.userIndex].id,
            categoryId:
              todoData.categoryIndex !== undefined
                ? categories[todoData.categoryIndex].id
                : null,
          },
        })
      )
    );

    console.log(`  ✓ Created ${todos.length} todos`);
    return todos;
  } catch (error) {
    console.error("❌ Error creating todos:", error);
    throw error;
  }
}

async function main() {
  console.log("🌱 Starting database seed...\n");
  const startTime = Date.now();

  try {
    // Clean existing data
    await cleanDatabase();

    // Seed users
    const users = await seedUsers();

    // Seed categories
    const categories = await seedCategories(users);

    // Seed todos
    const todos = await seedTodos(users, categories);

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n✅ Seed completed successfully!");
    console.log(`⏱️  Duration: ${duration}s`);
    console.log("\n📊 Summary:");
    console.log(`  • ${users.length} users`);
    console.log(`  • ${categories.length} categories`);
    console.log(`  • ${todos.length} todos`);
    console.log("\n🔐 Test credentials:");
    USERS_DATA.forEach((user) => {
      console.log(`  • ${user.email} / ${DEFAULT_PASSWORD}`);
    });
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    throw error;
  }
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
