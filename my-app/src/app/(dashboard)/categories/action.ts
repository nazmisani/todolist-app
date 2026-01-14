"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function getCategoriesData() {
  const userId = await getUserId();

  if (!userId) {
    return { categories: [] };
  }

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { todos: true },
      },
    },
  });

  return { categories };
}
