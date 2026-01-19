import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, FolderOpen, ListTodo, CheckCircle } from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { getDashboardData } from "@/app/(dashboard)/dashboard/action";

export default async function DashboardPage() {
  const { todos, categories } = await getDashboardData();

  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here's your overview
        </p>
      </div>

      <DashboardStats
        totalTodos={todos.length}
        completedCount={completedCount}
        pendingCount={pendingCount}
        categoriesCount={categories.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/todos"
              className="block p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ListTodo size={18} className="text-blue-600" />
                <span className="font-medium">Manage Todos</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Create and organize your tasks
              </p>
            </a>
            <a
              href="/categories"
              className="block p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FolderOpen size={18} className="text-purple-600" />
                <span className="font-medium">Manage Categories</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Organize your todos by category
              </p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <p className="text-gray-500">
                No todos yet. Start by creating your first todo!
              </p>
            ) : (
              <div className="space-y-3">
                {todos.slice(0, 3).map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <div
                      className={`mt-1 ${
                        todo.completed ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {todo.completed ? (
                        <CheckCircle size={16} />
                      ) : (
                        <CheckSquare size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.title}
                      </p>
                      {todo.category && (
                        <p className="text-xs text-gray-500 mt-1">
                          {todo.category.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
