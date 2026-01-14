"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function getDashboardData() {
  const userId = await getUserId();

  if (!userId) {
    return { todos: [], categories: [] };
  }

  const todos = await prisma.todo.findMany({
    where: { userId },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    where: { userId },
  });

  return { todos, categories };
}
