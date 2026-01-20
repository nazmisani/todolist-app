"use client";

import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { data: session } = useSession();

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
            Welcome back, {session?.user?.name || "User"}
          </h1>
        </div>
      </div>
    </div>
  );
}
