import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jose";
import { TokenPayload } from "./types/index";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const isAuthPage = path === "/login" || path === "/register";
  const isProtectedPage =
    path.startsWith("/dashboard") ||
    path.startsWith("/todos") ||
    path.startsWith("/categories");

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedPage && token) {
    try {
      await verifyToken<TokenPayload>(token);
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (isAuthPage && token) {
    try {
      await verifyToken<TokenPayload>(token);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/todos/:path*",
    "/categories/:path*",
    "/login",
    "/register",
  ],
};
