import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authCookieOptions, AUTH_COOKIE_NAME, createAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    const passwordMatches = user
      ? await bcrypt.compare(result.data.password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const token = await createAuthToken(user);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions());
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ message: "Unable to log in" }, { status: 500 });
  }
}