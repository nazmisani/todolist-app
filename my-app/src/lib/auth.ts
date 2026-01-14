import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jose";
import { TokenPayload } from "@/types";

export async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken<TokenPayload>(token);
    return payload.userId;
  } catch {
    return null;
  }
}
