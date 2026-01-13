"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, FolderOpen, ListTodo, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Todos",
      value: "0",
      icon: ListTodo,
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: "0",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: "0",
      icon: CheckSquare,
      color: "text-orange-600",
    },
    {
      title: "Categories",
      value: "0",
      icon: FolderOpen,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Welcome to your Todo App! Start by creating categories and adding your first todo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
