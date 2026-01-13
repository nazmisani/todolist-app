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

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Category
        </Button>
      </div>

      <CategoryTable
        categories={data?.categories || []}
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
