import "server-only";

export const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080"
).replace(/\/$/, "");
export const ADMIN_COOKIE = "yaron_admin_token";
