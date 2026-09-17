import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "internal_portal_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60;

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function createAuthToken(user: Pick<AuthenticatedUser, "id" | "email">) {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });

  if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("Invalid authentication token");
  }

  return { id: payload.sub, email: payload.email };
}

async function getUserFromAuthToken(token: string | undefined): Promise<AuthenticatedUser | null> {
  if (!token) {
    return null;
  }

  try {
    const identity = await verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: identity.id },
      select: { id: true, name: true, email: true },
    });

    return user;
  } catch {
    return null;
  }
}

/** Resolves the authenticated user from an API Route Handler request. */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  return getUserFromAuthToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

/** Resolves the authenticated user in Server Components and server actions. */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  return getUserFromAuthToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Authenticates an API request. Returns the user or a 401 JSON response (never redirects).
 */
export async function requireAuth(
  request: NextRequest,
): Promise<AuthenticatedUser | NextResponse> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return unauthorizedResponse();
  }

  return user;
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS,
  };
}