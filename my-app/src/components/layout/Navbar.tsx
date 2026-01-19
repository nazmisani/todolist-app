"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlices";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearUser());
    router.push("/login");
  };

  return (
    <div className="h-14 bg-white border-b px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm md:text-lg font-semibold text-gray-800 truncate">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-xs text-gray-500 truncate hidden sm:block">
            {user?.email}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex-shrink-0"
      >
        <LogOut size={16} className="md:mr-2" />
        <span className="hidden md:inline">Logout</span>
      </Button>
    </div>
  );
}
