"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTodo } from "@/hooks/useTodos";
import { TodoForm } from "@/components/forms/TodoForm";

interface TodoInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  categoryId?: string;
}

export default function CreateTodoPage() {
  const router = useRouter();
  const createTodo = useCreateTodo();

  const handleSubmit = (data: TodoInput) => {
    createTodo.mutate(data, {
      onSuccess: () => {
        router.push("/todos");
      },
    });
  };

  const handleCancel = () => {
    router.push("/todos");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Todo</h1>
        <p className="text-gray-500 mt-1">Add a new task to your list</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createTodo.isPending}
            submitLabel="Create Todo"
          />
        </CardContent>
      </Card>
    </div>
  );
}
