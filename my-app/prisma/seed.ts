import { PrismaClient, Priority } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";

dotenv.config();

// ============================================
// Database Configuration
// ============================================
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
  connectionString,
  password: process.env.DATABASE_URL?.match(/:(.*?)@/)?.[1] || "postgres",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================
// Type Definitions
// ============================================
type UserSeedData = {
  email: string;
  name: string;
  password: string;
};

type CategorySeedData = {
  name: string;
  userEmail: string;
};

type TodoSeedData = {
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  userEmail: string;
  categoryName?: string;
};

// ============================================
// Data Loading Functions
// ============================================
function loadJsonData<T>(filename: string): T {
  const filePath = join(__dirname, "data", filename);
  const fileContent = readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// ============================================
// Seeding Functions
// ============================================
async function seedUsers() {
  console.log("🌱 Seeding users...");
  const usersData = loadJsonData<UserSeedData[]>("users.json");

  const users = await Promise.all(
    usersData.map(async (userData) => {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      return prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
        },
      });
    }),
  );

  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function seedCategories() {
  console.log("🌱 Seeding categories...");
  const categoriesData = loadJsonData<CategorySeedData[]>("categories.json");

  const categories = await Promise.all(
    categoriesData.map(async (categoryData) => {
      const user = await prisma.user.findUnique({
        where: { email: categoryData.userEmail },
      });

      if (!user) {
        throw new Error(`User not found: ${categoryData.userEmail}`);
      }

      return prisma.category.create({
        data: {
          name: categoryData.name,
          userId: user.id,
        },
      });
    }),
  );

  console.log(`✅ Created ${categories.length} categories`);
  return categories;
}

async function seedTodos() {
  console.log("🌱 Seeding todos...");
  const todosData = loadJsonData<TodoSeedData[]>("todos.json");

  const todos = await Promise.all(
    todosData.map(async (todoData) => {
      const user = await prisma.user.findUnique({
        where: { email: todoData.userEmail },
      });

      if (!user) {
        throw new Error(`User not found: ${todoData.userEmail}`);
      }

      let categoryId: string | undefined;
      if (todoData.categoryName) {
        const category = await prisma.category.findFirst({
          where: {
            name: todoData.categoryName,
            userId: user.id,
          },
        });

        if (category) {
          categoryId = category.id;
        }
      }

      return prisma.todo.create({
        data: {
          title: todoData.title,
          description: todoData.description,
          completed: todoData.completed,
          priority: todoData.priority,
          dueDate: todoData.dueDate ? new Date(todoData.dueDate) : undefined,
          userId: user.id,
          categoryId,
        },
      });
    }),
  );

  console.log(`✅ Created ${todos.length} todos`);
  return todos;
}

// ============================================
// Statistics Function
// ============================================
async function printStatistics() {
  console.log("\n📊 Database Statistics:");
  console.log("========================");

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          todos: true,
          categories: true,
        },
      },
    },
  });

  users.forEach((user) => {
    console.log(`\n👤 ${user.name} (${user.email})`);
    console.log(`   📝 Todos: ${user._count.todos}`);
    console.log(`   📁 Categories: ${user._count.categories}`);
  });

  const totalTodos = await prisma.todo.count();
  const completedTodos = await prisma.todo.count({
    where: { completed: true },
  });
  const pendingTodos = totalTodos - completedTodos;

  console.log("\n📈 Overall Statistics:");
  console.log(`   Total Todos: ${totalTodos}`);
  console.log(`   Completed: ${completedTodos}`);
  console.log(`   Pending: ${pendingTodos}`);
  console.log(
    `   Completion Rate: ${((completedTodos / totalTodos) * 100).toFixed(1)}%`,
  );

  console.log("\n🔐 Test Credentials:");
  console.log("   Email: john@example.com | Password: password123");
  console.log("   Email: jane@example.com | Password: password123");
  console.log("   Email: alice@example.com | Password: password123");
}

// ============================================
// Main Seeding Function
// ============================================
async function main() {
  console.log("🚀 Starting database seeding...\n");

  try {
    await seedUsers();
    await seedCategories();
    await seedTodos();

    await printStatistics();

    console.log("\n✨ Seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    throw error;
  }
}

// ============================================
// Execution
// ============================================
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
