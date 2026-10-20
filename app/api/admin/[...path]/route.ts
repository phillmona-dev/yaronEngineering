import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { ADMIN_COOKIE, API_URL } from "@/lib/blog/server";
import { SITE_CONTENT_TAG } from "@/lib/content/server";

/**
 * Authenticated proxy: /api/admin/<path> → <API_URL>/api/v1/<path> with the JWT from the
 * httpOnly cookie. The token never reaches browser JavaScript.
 */
async function proxy(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token)
    return NextResponse.json({ code: "UNAUTHORIZED", message: "Please sign in." }, { status: 401 });

  const url = new URL(req.url);
  const target = `${API_URL}/api/v1/${path.map(encodeURIComponent).join("/")}${url.search}`;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  const ct = req.headers.get("content-type");
  if (ct) headers.set("Content-Type", ct);
  headers.set("Accept", "application/json");

  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers,
    cache: "no-store",
  };
  if (!["GET", "HEAD"].includes(req.method)) {
    init.body = req.body;
    init.duplex = "half";
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return NextResponse.json(
      { code: "UPSTREAM_UNAVAILABLE", message: "The publishing service is unreachable." },
      { status: 502 },
    );
  }
  // Website content edits must show up immediately: purge the whole public site cache.
  if (path[0] === "site-content" && !["GET", "HEAD"].includes(req.method) && upstream.ok) {
    revalidateTag(SITE_CONTENT_TAG);
    revalidatePath("/", "layout");
  }
  const resHeaders = new Headers();
  const uct = upstream.headers.get("content-type");
  if (uct) resHeaders.set("Content-Type", uct);
  const loc = upstream.headers.get("location");
  if (loc) resHeaders.set("Location", loc);
  return new NextResponse(upstream.status === 204 ? null : upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
