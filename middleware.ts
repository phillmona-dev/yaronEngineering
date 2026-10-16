import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "yaron_admin_token";
/** Admin pages reachable without a session (password recovery). */
const PUBLIC_ADMIN_PATHS = new Set(["/admin/forgot-password", "/admin/reset-password"]);

/** Gate the admin UI on the presence of the session cookie; the backend still validates every call. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(ADMIN_COOKIE)?.value);
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (hasSession) return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.next();
    }
    if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();
    if (!hasSession) {
      const login = new URL("/admin/login", req.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }
  const res = NextResponse.next();
  if (pathname.startsWith("/admin")) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
