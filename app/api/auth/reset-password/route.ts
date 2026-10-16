import { NextResponse } from "next/server";
import { API_URL, forwardedFor } from "@/lib/blog/server";

/** Public: consumes a reset token and sets a new password. */
export async function POST(req: Request) {
  let body: { token?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...forwardedFor(req) },
      body: JSON.stringify({ token: body.token, newPassword: body.newPassword }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "The publishing service is unreachable." },
      { status: 502 },
    );
  }
  if (upstream.status === 204) return NextResponse.json({ ok: true });
  const json = await upstream.json().catch(() => ({}));
  return NextResponse.json(
    { code: json.code, message: json.message ?? "Password reset failed", errors: json.errors },
    { status: upstream.status },
  );
}
