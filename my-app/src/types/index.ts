export interface TokenPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  userId: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
