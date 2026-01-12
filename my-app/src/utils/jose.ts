import * as jose from "jose";
import { TokenPayload } from "@/types/index";

const SECRET_KEY = process.env.JWT_SECRET || "this-is-not-a-safe-key";
const secretKey = new TextEncoder().encode(SECRET_KEY);

export const generateToken = async (payload: TokenPayload) => {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secretKey);
  return token;
};

export const verifyToken = async <T>(token: string): Promise<T> => {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as T;
  } catch {
    throw new Error("Invalid token");
  }
};
