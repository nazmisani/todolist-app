"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryTable from "@/components/tables/CategoryTable";
import CategoryForm from "@/components/forms/CategoryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  createdAt: string | Date;
  _count?: {
    todos: number;
  };
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const handleEdit = (category: Category) => {
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
        },
      );
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize your todos by category
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus size={16} className="mr-2" />
          New Category
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <CategoryTable
          categories={displayCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        initialData={
          editingCategory ? { name: editingCategory.name } : undefined
        }
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this category? This action cannot be
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
