import { create } from "zustand";
import { Todo } from "@/types";

interface TodoStore {
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
  clearSelectedTodo: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  selectedTodo: null,

  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  clearSelectedTodo: () => set({ selectedTodo: null }),
}));
