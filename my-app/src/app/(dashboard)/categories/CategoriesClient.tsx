"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryTable from "@/components/tables/CategoryTable";
import CategoryForm from "@/components/forms/CategoryForm";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
  _count?: {
    todos: number;
  };
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const displayCategories = data?.categories || initialCategories;

  const handleCreate = (formData: { name: string }) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleUpdate = (formData: { name: string }) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data: formData },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingCategory(null);
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your todos by category</p>
        </div>
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Category
        </Button>
      </div>

      <CategoryTable
        categories={displayCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        initialData={
          editingCategory ? { name: editingCategory.name } : undefined
        }
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
