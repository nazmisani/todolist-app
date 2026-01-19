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
    <div className="h-14 bg-white border-b px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>
    </div>
  );
}
