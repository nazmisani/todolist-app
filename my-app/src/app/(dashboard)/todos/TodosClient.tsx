"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TodoTable } from "@/components/tables/TodoTable";
import { TodoForm } from "@/components/forms/TodoForm";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useToggleTodo,
} from "@/hooks/useTodos";
import { Todo } from "@/types";

interface TodosClientProps {
  initialTodos: Todo[];
}

export function TodosClient({ initialTodos }: TodosClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const { data: todos } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const toggleTodo = useToggleTodo();

  const displayTodos = todos || initialTodos;

  const handleCreate = (data: any) => {
    createTodo.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editingTodo) return;

    updateTodo.mutate(
      { id: editingTodo.id, data },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingTodo(null);
        },
      }
    );
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo.mutate(id);
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodo.mutate({ id, completed });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <p className="text-gray-500 mt-1">Manage and track your tasks</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Tasks</CardTitle>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Todo
          </Button>
        </CardHeader>
        <CardContent>
          <TodoTable
            todos={displayTodos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </CardContent>
      </Card>

      <TodoForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingTodo ? handleUpdate : handleCreate}
        initialData={editingTodo}
      />
    </div>
  );
}
