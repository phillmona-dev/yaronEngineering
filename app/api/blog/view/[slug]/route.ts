import { NextResponse } from "next/server";
import { API_URL } from "@/lib/blog/server";

/** Forwards a view beacon to the backend with the reader's IP/UA so dedupe happens server-side. */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  try {
    await fetch(`${API_URL}/api/v1/public/articles/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      headers: { "X-Forwarded-For": ip, "User-Agent": req.headers.get("user-agent") ?? "" },
    });
  } catch {
    /* analytics must never fail the page */
  }
  return new NextResponse(null, { status: 204 });
}
