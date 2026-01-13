"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckSquare, FolderOpen } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/todos", label: "Todos", icon: CheckSquare },
    { href: "/categories", label: "Categories", icon: FolderOpen },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-8 pb-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Todo App</h2>
        <p className="text-xs text-gray-500 mt-1">Organize your tasks</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
