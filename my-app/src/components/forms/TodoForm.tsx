"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Todo } from "@/types";
import { useCategories } from "@/hooks/useCategories";

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TodoFormData) => void;
  initialData?: Todo | null;
}

export function TodoForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: TodoFormProps) {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        priority: initialData.priority,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
        categoryId: initialData.categoryId || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        categoryId: "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: TodoFormData) => {
    onSubmit(data);
    reset();
  };

  const priorityValue = watch("priority");
  const categoryValue = watch("categoryId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Todo" : "Create New Todo"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update your todo details below."
              : "Fill in the details to create a new todo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
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
              rows={3}
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
              {errors.priority && (
                <p className="text-sm text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category (Optional)</Label>
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
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
