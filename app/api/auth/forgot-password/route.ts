import { NextResponse } from "next/server";
import { API_URL, forwardedFor } from "@/lib/blog/server";

/** Public: asks the API to email a one-time reset link. The reply never reveals whether the account exists. */
export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...forwardedFor(req) },
      body: JSON.stringify({ email: body.email }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "The publishing service is unreachable." },
      { status: 502 },
    );
  }
  const json = await upstream.json().catch(() => ({}));
  return NextResponse.json(
    { message: json.message ?? "Request received." },
    { status: upstream.status },
  );
}
