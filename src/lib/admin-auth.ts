import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const scryptAsync = promisify(scrypt);

export const ADMIN_SESSION_COOKIE = "akramul_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  adminId: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set to a random value of at least 32 characters.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedPassword: string) {
  const passwordParts = storedPassword.split("$");
  const [algorithm, salt, encodedKey] = passwordParts;

  if (algorithm === "scrypt") {
    if (
      passwordParts.length !== 3 ||
      !salt ||
      !encodedKey ||
      !/^[a-f\d]{32}$/i.test(salt) ||
      !/^[a-f\d]{128}$/i.test(encodedKey)
    ) {
      return false;
    }
    const expectedKey = Buffer.from(encodedKey, "hex");
    const derivedKey = (await scryptAsync(password, salt, expectedKey.length)) as Buffer;
    return derivedKey.length === expectedKey.length && timingSafeEqual(derivedKey, expectedKey);
  }

  // Existing installations may still have a legacy plaintext value. It is
  // never returned to the client and is intentionally not migrated on sign-in:
  // the administrator explicitly migrates it by setting a new password, which
  // avoids an unapproved production-record mutation during authentication.
  return safeEqual(password, storedPassword);
}

export function createSession(adminId: string) {
  const payload: SessionPayload = {
    adminId,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySession(value?: string): SessionPayload | null {
  if (!value) return null;

  const [encodedPayload, signature] = value.split(".");
  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.adminId || !Number.isFinite(payload.expiresAt) || payload.expiresAt <= Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, session: string) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: session,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function requireAdmin(request: NextRequest) {
  return verifySession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))
    ?.split(",")[0]
    ?.trim();
  const protocol = (request.headers.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http"))
    .split(",")[0]
    .trim()
    .replace(/:$/, "");

  if (!origin || !host || !protocol) return false;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host && originUrl.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

export async function getPageAdminSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
