"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateTodo } from "@/hooks/useTodos";
import { todoService } from "@/services/todoService";
import { useQuery } from "@tanstack/react-query";
import { useTodoStore } from "@/store/todoStore";
import { TodoForm } from "@/components/forms/TodoForm";
import { LoadingSpinner } from "@/components/ui/loading";

interface TodoInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  categoryId?: string;
}

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const todoId = params.id as string;

  const updateTodo = useUpdateTodo();

  // ambil dari zustand store dulu, kalau kosong baru fetch
  const { selectedTodo, setSelectedTodo, clearSelectedTodo } = useTodoStore();

  const { data: fetchedTodo, isLoading } = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => todoService.getById(todoId),
    enabled: !selectedTodo || selectedTodo.id !== todoId,
  });

  // simpan ke store setelah fetch
  useEffect(() => {
    if (fetchedTodo && (!selectedTodo || selectedTodo.id !== todoId)) {
      setSelectedTodo(fetchedTodo);
    }
  }, [fetchedTodo, selectedTodo, todoId, setSelectedTodo]);

  const todo = selectedTodo?.id === todoId ? selectedTodo : fetchedTodo;

  const handleSubmit = (data: TodoInput) => {
    updateTodo.mutate(
      { id: todoId, data },
      {
        onSuccess: () => {
          toast.success("Todo updated successfully");
          clearSelectedTodo();
          router.push("/todos");
        },
        onError: () => {
          toast.error("Failed to update todo");
        },
      },
    );
  };

  const handleCancel = () => {
    clearSelectedTodo();
    router.push("/todos");
  };

  if (isLoading && !todo) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Todo</h1>
        <p className="text-gray-500 mt-1">Update your task details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={todo}
            isLoading={updateTodo.isPending}
            submitLabel="Update Todo"
          />
        </CardContent>
      </Card>
    </div>
  );
}
