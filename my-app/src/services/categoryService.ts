const API_URL = "/api/categories";

interface CreateCategoryInput {
  name: string;
}

export const categoryService = {
  getAll: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch category");
    return res.json();
  },

  create: async (data: CreateCategoryInput) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  },

  update: async (id: string, data: CreateCategoryInput) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update category");
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return res.json();
  },
};
