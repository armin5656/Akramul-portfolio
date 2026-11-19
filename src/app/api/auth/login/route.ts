import { NextRequest, NextResponse } from "next/server";
import { createSession, isSameOriginRequest, setSessionCookie, verifyPassword } from "@/lib/admin-auth";
import { limitLoginAttempt } from "@/lib/login-rate-limit";
import { connectToDB } from "@/lib/mongoose";
import Admin from "@/models/Admin.model";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      body = null;
    }

    const email = body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>).email
      : undefined;
    const rateLimit = await limitLoginAttempt(request, typeof email === "string" ? email : undefined);
    if (!rateLimit.allowed) {
      if (rateLimit.reason === "configuration") {
        return NextResponse.json({ error: "Sign-in is temporarily unavailable." }, { status: 503 });
      }
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 900) } }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid sign-in request." }, { status: 400 });
    }

    const { password } = body as Record<string, unknown>;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      password.length === 0 ||
      email.length > 254 ||
      password.length > 256
    ) {
      return NextResponse.json({ error: "Enter a valid email address and password." }, { status: 400 });
    }

    await connectToDB();
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const valid = admin && (await verifyPassword(password, admin.password));

    if (!valid || !admin) {
      return NextResponse.json({ error: "Invalid email address or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    setSessionCookie(response, createSession(admin.id));
    return response;
  } catch (error) {
    console.error("POST /api/auth/login failed", error);
    return NextResponse.json({ error: "Sign-in is unavailable. Check server configuration." }, { status: 503 });
  }
}
