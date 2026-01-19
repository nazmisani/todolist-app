"use client";

import { useAppSelector } from "@/store/hooks";
import { Menu, Search, Bell } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
        >
          <Menu size={20} className="text-gray-600 group-hover:text-gray-900" />
        </button>
        <div className="hidden md:flex items-center gap-3">
          <div className="h-8 w-px bg-gray-200" />
          <h1 className="text-base font-semibold text-gray-900">
            Welcome back, {user?.name || "User"}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 relative">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </div>
  );
}
