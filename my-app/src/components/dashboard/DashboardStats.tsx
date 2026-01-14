"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, FolderOpen, ListTodo, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
  totalTodos: number;
  completedCount: number;
  pendingCount: number;
  categoriesCount: number;
}

export default function DashboardStats({
  totalTodos,
  completedCount,
  pendingCount,
  categoriesCount,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Todos",
      value: totalTodos.toString(),
      icon: ListTodo,
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: completedCount.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: pendingCount.toString(),
      icon: CheckSquare,
      color: "text-orange-600",
    },
    {
      title: "Categories",
      value: categoriesCount.toString(),
      icon: FolderOpen,
      color: "text-purple-600",
    },
  ];

  return (
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
  );
}
