import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/jose";
import { TokenPayload } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    await verifyToken<TokenPayload>(token);
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
