import { NextResponse } from "next/server";
import { API_URL } from "@/lib/blog/server";

export async function POST(req: Request) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return NextResponse.json({ ok: false }, { status: 422 });
  try {
    const res = await fetch(`${API_URL}/api/v1/public/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email.trim(), source: body.source ?? "blog" }),
    });
    if (!res.ok) throw new Error(String(res.status));
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
