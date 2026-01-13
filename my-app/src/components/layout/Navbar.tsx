"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlices";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearUser());
    router.push("/login");
  };

  return (
    <div className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut size={18} className="mr-2" />
        Logout
      </Button>
    </div>
  );
}
