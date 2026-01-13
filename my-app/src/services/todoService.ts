const API_URL = "/api/todos";

interface CreateTodoInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  categoryId?: string;
}

export const todoService = {
  getAll: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json();
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch todo");
    return res.json();
  },

  create: async (data: CreateTodoInput) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json();
  },

  update: async (id: string, data: CreateTodoInput) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
  },

  toggleComplete: async (id: string, completed: boolean) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error("Failed to toggle todo");
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
    return res.json();
  },
};
