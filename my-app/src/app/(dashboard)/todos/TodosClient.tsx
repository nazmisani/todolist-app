"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TodoTable } from "@/components/tables/TodoTable";
import { useTodos, useDeleteTodo, useToggleTodo } from "@/hooks/useTodos";
import { Todo } from "@/types";
import { useTodoStore } from "@/store/todoStore";
import { LoadingTable } from "@/components/ui/loading";

interface TodosClientProps {
  initialTodos: Todo[];
}

export function TodosClient({ initialTodos }: TodosClientProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: todos, isLoading } = useTodos();
  const deleteTodo = useDeleteTodo();
  const toggleTodo = useToggleTodo();
  const { setSelectedTodo } = useTodoStore();

  const displayTodos = todos || initialTodos;

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    router.push(`/todos/${todo.id}/edit`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTodo.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Todo deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete todo");
        },
      });
      setDeleteId(null);
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodo.mutate(
      { id, completed },
      {
        onSuccess: () => {
          toast.success(
            completed ? "Todo marked as done" : "Todo marked as pending",
          );
        },
        onError: () => {
          toast.error("Failed to update todo");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">My Todos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track your tasks
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <CardTitle className="text-base md:text-lg">All Tasks</CardTitle>
          <Button
            size="sm"
            onClick={() => router.push("/todos/create")}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Todo
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : (
            <TodoTable
              todos={displayTodos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Todo</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this todo? This action cannot be
            undone.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
