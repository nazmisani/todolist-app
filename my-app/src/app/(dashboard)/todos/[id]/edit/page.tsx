"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todoSchema } from "@/validators/todoSchema";
import { useUpdateTodo } from "@/hooks/useTodos";
import { useCategories } from "@/hooks/useCategories";
import { todoService } from "@/services/todoService";
import { useQuery } from "@tanstack/react-query";

type TodoFormData = z.infer<typeof todoSchema>;

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const todoId = params.id as string;

  const updateTodo = useUpdateTodo();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories || [];

  const { data: todo, isLoading } = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => todoService.getById(todoId),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
        categoryId: todo.categoryId || "",
      });
    }
  }, [todo, reset]);

  const onSubmit = (data: TodoFormData) => {
    updateTodo.mutate(
      { id: todoId, data },
      {
        onSuccess: () => {
          router.push("/todos");
        },
      },
    );
  };

  const priorityValue = watch("priority");
  const categoryValue = watch("categoryId");

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <p className="text-center text-gray-500">Loading...</p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter todo title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter todo description (optional)"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priorityValue}
                  onValueChange={(value) =>
                    setValue("priority", value as "low" | "medium" | "high")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" {...register("dueDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={categoryValue || undefined}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/todos")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTodo.isPending}>
                {updateTodo.isPending ? "Updating..." : "Update Todo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
