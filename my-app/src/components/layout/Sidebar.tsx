"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CheckSquare, FolderOpen, X, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlices";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearUser());
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/todos", label: "Todos", icon: CheckSquare },
    { href: "/categories", label: "Categories", icon: FolderOpen },
  ];

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 bg-white border-r h-screen transition-transform duration-300 w-64 relative ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:block ${isOpen ? "md:w-64" : "md:w-0"}`}
      >
        {isOpen && (
          <>
            <div className="p-4 w-64 pb-32">
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Todo App</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Organize your tasks
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="md:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleLinkClick}
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

            <div className="absolute bottom-0 left-0 right-0 p-4 w-64 border-t bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
