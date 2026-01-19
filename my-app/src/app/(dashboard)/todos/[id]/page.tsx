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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/todos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Todo Details</h1>
            <p className="text-gray-500 mt-1">View todo information</p>
          </div>
        </div>
        <Link href={`/todos/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{todo.title}</CardTitle>
            <Badge
              className={priorityColors[todo.priority]}
              variant="secondary"
            >
              {todo.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Description
            </h3>
            <p className="text-gray-700">
              {todo.description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Status
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    todo.completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-gray-700">
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
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

          {todo.dueDate && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </h3>
              <p className="text-gray-700">
                {format(new Date(todo.dueDate), "MMMM dd, yyyy")}
              </p>
            </div>
          )}

          {todo.category && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Category
              </h3>
              <Badge variant="outline">{todo.category.name}</Badge>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p>Created</p>
                <p className="text-gray-700 mt-1">
                  {format(new Date(todo.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p>Last Updated</p>
                <p className="text-gray-700 mt-1">
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
