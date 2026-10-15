import { NextResponse } from "next/server";
import { API_URL } from "@/lib/blog/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  organization?: string;
  subject?: string;
  message?: string;
  company_website?: string; // honeypot
};

const MAX = { name: 120, email: 200, organization: 160, subject: 120, message: 4000 };

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Contact form endpoint. Messages are stored in the CMS inbox (Spring Boot API) so the team can
 * review and manage them at /admin/messages. An optional webhook receives a copy.
 */
export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: silently accept bot submissions without processing.
  if (body.company_website) return NextResponse.json({ ok: true, message: "Thank you." });

  const data = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    organization: clean(body.organization, MAX.organization) || undefined,
    subject: clean(body.subject, MAX.subject),
    message: clean(body.message, MAX.message),
    source: "website",
  };

  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.subject || data.message.length < 20) {
    return NextResponse.json({ ok: false, message: "Please complete all required fields." }, { status: 422 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  let stored = false;
  try {
    const res = await fetch(`${API_URL}/api/v1/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": ip, "User-Agent": req.headers.get("user-agent") ?? "" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (res.status === 429) {
      return NextResponse.json({ ok: false, message: "Too many messages from this connection. Please try again later." }, { status: 429 });
    }
    stored = res.ok;
    if (!res.ok) console.error("[contact] inbox rejected submission", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("[contact] inbox unreachable", err);
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  let forwarded = false;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
      });
      forwarded = res.ok;
    } catch (err) {
      console.error("[contact] webhook delivery failed", err);
    }
  }

  if (!stored && !forwarded) {
    console.info("[contact] submission could not be delivered; logged only", data);
    return NextResponse.json(
      { ok: false, message: "We could not deliver your message right now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you — your message has been received. Our team will respond within one business day.",
  });
}
