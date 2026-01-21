"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
  isLoading?: boolean;
}

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-100 rounded-lg">
              <FolderOpen className="h-5 w-5 text-slate-700" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                {initialData ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {initialData
                  ? "Update the category name below."
                  : "Add a new category to organize your todos."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 mt-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name *
            </Label>
            <Input
              id="name"
              {...register("name")}
              disabled={isLoading}
              placeholder="e.g. Work, Personal, Health"
              className="h-10"
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-24 bg-slate-700 hover:bg-slate-800"
            >
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
