const API_URL = "/api/todos";

interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  categoryId?: string;
}

export const todoService = {
  getAll: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  create: async (data: CreateTodoInput) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create");
    return res.json();
  },
};
