import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlices";

export function useTokenCheck() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        if (!response.ok) {
          dispatch(clearUser());
          router.push("/login");
        }
      } catch (error) {
        dispatch(clearUser());
        router.push("/login");
      }
    };

    // Check token setiap 5 menit
    checkToken();
    const interval = setInterval(checkToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, router]);
}
