import { getTodosData } from "./action";
import { TodosClient } from "./TodosClient";

export default async function TodosPage() {
  const { todos } = await getTodosData();

  return <TodosClient initialTodos={todos} />;
}
