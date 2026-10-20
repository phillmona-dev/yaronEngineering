import "server-only";
import { cache } from "react";
import { DEFAULT_CONTENT } from "./defaults";
import { mergeSiteContent } from "./merge";
import type { SiteContent } from "./types";

const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080"
).replace(/\/$/, "");

/** Cache tag purged by the admin proxy whenever a section is saved or reset. */
export const SITE_CONTENT_TAG = "site-content";
const REVALIDATE = Number(process.env.SITE_CONTENT_REVALIDATE_SECONDS ?? 300);

/**
 * The website's content: built-in defaults overlaid with whatever the owner has customised in
 * the admin panel. Deduplicated per request by React's cache, so layouts, pages and sections
 * can all call it freely. If the API is unreachable the site simply renders its defaults.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const res = await fetch(`${API_URL}/api/v1/public/site-content`, {
      next: { revalidate: REVALIDATE, tags: [SITE_CONTENT_TAG] },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const overrides = (await res.json()) as Partial<Record<keyof SiteContent, unknown>>;
    return mergeSiteContent(DEFAULT_CONTENT, overrides ?? {});
  } catch (err) {
    if (process.env.NODE_ENV !== "test")
      console.warn(
        "[site-content] using built-in content:",
        err instanceof Error ? err.message : err,
      );
    return DEFAULT_CONTENT;
  }
});
