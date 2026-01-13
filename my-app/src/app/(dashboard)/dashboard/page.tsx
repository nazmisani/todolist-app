"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, FolderOpen, ListTodo, CheckCircle } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import { useCategories } from "@/hooks/useCategories";

export default function DashboardPage() {
  const { data: todosData, isLoading: loadingTodos } = useTodos();
  const { data: categoriesData, isLoading: loadingCategories } =
    useCategories();

  const todos = todosData || [];
  const categories = categoriesData?.categories || [];

  const completedCount = todos.filter((todo: any) => todo.completed).length;
  const pendingCount = todos.filter((todo: any) => !todo.completed).length;

  const stats = [
    {
      title: "Total Todos",
      value: loadingTodos ? "..." : todos.length.toString(),
      icon: ListTodo,
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: loadingTodos ? "..." : completedCount.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: loadingTodos ? "..." : pendingCount.toString(),
      icon: CheckSquare,
      color: "text-orange-600",
    },
    {
      title: "Categories",
      value: loadingCategories ? "..." : categories.length.toString(),
      icon: FolderOpen,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={stat.color} size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
            {loadingTodos ? (
              <p className="text-gray-500">Loading...</p>
            ) : todos.length === 0 ? (
              <p className="text-gray-500">
                No todos yet. Start by creating your first todo!
              </p>
            ) : (
              <div className="space-y-3">
                {todos.slice(0, 3).map((todo: any) => (
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
