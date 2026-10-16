import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, API_URL } from "@/lib/blog/server";
import type { LoginResponse } from "@/lib/blog/types";

/**
 * Changes the signed-in user's password. The API rotates the JWT (tokens issued before the
 * change stop working), so the fresh token replaces the session cookie here.
 */
export async function POST(req: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token)
    return NextResponse.json({ code: "UNAUTHORIZED", message: "Please sign in." }, { status: 401 });

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/v1/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { code: "UPSTREAM_UNAVAILABLE", message: "The publishing service is unreachable." },
      { status: 502 },
    );
  }
  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.json(
      { code: err.code, message: err.message ?? "Password change failed", errors: err.errors },
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
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false",
    path: "/",
    maxAge: data.expiresIn ?? 43200,
  });
  return res;
}
