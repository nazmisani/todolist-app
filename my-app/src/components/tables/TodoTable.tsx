"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Todo } from "@/types";
import { format } from "date-fns";

interface TodoTableProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, completed: boolean) => void;
}

const createColumns = (
  onEdit: (todo: Todo) => void,
  onDelete: (id: string) => void,
  onToggle: (id: string, completed: boolean) => void,
): ColumnDef<Todo>[] => [
  {
    id: "completed",
    header: "",
    accessorFn: (row) => row.completed,
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "all") return true;
      if (filterValue === "completed") return row.original.completed === true;
      if (filterValue === "pending") return row.original.completed === false;
      return true;
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.completed}
        onCheckedChange={(checked) =>
          onToggle(row.original.id, checked as boolean)
        }
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: "includesString",
    cell: ({ row }) => (
      <div>
        <div
          className={row.original.completed ? "line-through text-gray-500" : ""}
        >
          {row.original.title}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {row.original.description || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    accessorFn: (row) => row.category?.name,
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "all") return true;
      return row.original.category?.name === filterValue;
    },
    cell: ({ row }) => (
      <span className="text-sm">{row.original.category?.name || "-"}</span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "all") return true;
      return row.original.priority === filterValue;
    },
    cell: ({ row }) => {
      const priority = row.original.priority;
      const colors = {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}
        >
          {priority}
        </span>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      if (!dueDate) return <span className="text-sm text-gray-500">-</span>;

      return (
        <span className="text-sm whitespace-nowrap">
          {format(new Date(dueDate), "MMM dd, yyyy")}
        </span>
      );
    },
    meta: {
      className: "hidden xl:table-cell",
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <Link
          href={`/todos/${row.original.id}`}
          className="hidden xl:inline-block"
        >
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(row.original.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];

export function TodoTable({
  todos,
  onEdit,
  onDelete,
  onToggle,
}: TodoTableProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const columns = useMemo(
    () => createColumns(onEdit, onDelete, onToggle),
    [onEdit, onDelete, onToggle],
  );

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const categories = useMemo(() => {
    return Array.from(
      new Set(todos.map((todo) => todo.category?.name).filter(Boolean)),
    );
  }, [todos]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
        <Input
          placeholder="Search by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="w-full sm:max-w-xs"
        />

        {mounted && (
          <>
            <Select
              value={
                (table.getColumn("priority")?.getFilterValue() as string) ||
                "all"
              }
              onValueChange={(value) =>
                table.getColumn("priority")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-full sm:w-37.5">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                (table.getColumn("completed")?.getFilterValue() as string) ||
                "all"
              }
              onValueChange={(value) =>
                table.getColumn("completed")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-full sm:w-37.5">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                (table.getColumn("category")?.getFilterValue() as string) ||
                "all"
              }
              onValueChange={(value) =>
                table.getColumn("category")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-full sm:w-37.5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat as string}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      (header.column.columnDef.meta as { className?: string })
                        ?.className
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as { className?: string })
                          ?.className
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No todos found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
        <div className="text-xs sm:text-sm text-gray-500">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-xs sm:text-sm whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
