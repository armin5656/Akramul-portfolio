import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, isSameOriginRequest } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
