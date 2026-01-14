"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { Todo } from "@/types";

export async function getTodosData() {
  const userId = await getUserId();

  if (!userId) {
    return { todos: [] };
  }

  const todosData = await prisma.todo.findMany({
    where: { userId },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const todos: Todo[] = todosData.map((todo) => ({
    ...todo,
    description: todo.description ?? undefined,
    dueDate: todo.dueDate ?? undefined,
    categoryId: todo.categoryId ?? undefined,
    category: todo.category ?? undefined,
  }));

  return { todos };
}
