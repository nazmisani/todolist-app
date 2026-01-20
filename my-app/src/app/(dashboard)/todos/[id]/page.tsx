import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Tag, Edit } from "lucide-react";
import { format } from "date-fns";

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!todo) {
    notFound();
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/todos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Todo Details</h1>
            <p className="text-sm text-gray-500 mt-1">View todo information</p>
          </div>
          <Link href={`/todos/${id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl font-bold">{todo.title}</CardTitle>
            <Badge
              className={priorityColors[todo.priority]}
              variant="secondary"
            >
              {todo.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {todo.description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    todo.completed ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-gray-900 font-medium">
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Priority
              </h3>
              <Badge
                className={priorityColors[todo.priority]}
                variant="secondary"
              >
                {todo.priority}
              </Badge>
            </div>
          </div>

          {(todo.category || todo.dueDate) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todo.category && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </h3>
                  <Badge variant="outline" className="font-normal">
                    {todo.category.name}
                  </Badge>
                </div>
              )}

              {todo.dueDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {format(new Date(todo.dueDate), "MMMM dd, yyyy")}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Created
                </p>
                <p className="text-gray-900">
                  {format(new Date(todo.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Last Updated
                </p>
                <p className="text-gray-900">
                  {format(new Date(todo.updatedAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
