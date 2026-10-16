import "server-only";

export const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080"
).replace(/\/$/, "");
export const ADMIN_COOKIE = "yaron_admin_token";

/** Client IP forwarded to the API so its per-IP rate limits apply to the visitor, not to this server. */
export function forwardedFor(req: Request): Record<string, string> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "";
  return ip ? { "X-Forwarded-For": ip } : {};
}
