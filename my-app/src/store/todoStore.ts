import { create } from "zustand";
import { Todo } from "@/types";

interface TodoStore {
  selectedTodo: Todo | null;
  isLoading: boolean;

  setSelectedTodo: (todo: Todo | null) => void;
  setLoading: (loading: boolean) => void;
  clearSelectedTodo: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  selectedTodo: null,
  isLoading: false,

  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearSelectedTodo: () => set({ selectedTodo: null }),
}));
