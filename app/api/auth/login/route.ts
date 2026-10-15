import { NextResponse } from "next/server";
import { ADMIN_COOKIE, API_URL } from "@/lib/blog/server";
import type { LoginResponse } from "@/lib/blog/types";

/** Exchanges credentials for a backend JWT and stores it in an httpOnly cookie. */
export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "The publishing service is unreachable." },
      { status: 502 },
    );
  }
  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({ message: "Login failed" }));
    return NextResponse.json(
      { message: err.message ?? "Login failed" },
      { status: upstream.status },
    );
  }
  const data = (await upstream.json()) as LoginResponse;
  const res = NextResponse.json({ user: data.user });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: data.accessToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: data.expiresIn ?? 43200,
  });
  return res;
}
