export function formatDate(
  iso: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = {},
): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function readingTime(minutes: number | null | undefined): string {
  return `${Math.max(1, minutes ?? 1)} min read`;
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${Math.round(s)}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}

/** Resolve a media URL that may be site-relative (frontend-hosted) or absolute (backend-hosted). */
export function mediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//.test(url) || url.startsWith("/")) return url;
  return `/${url}`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Rough client-side reading time estimate from HTML (server value wins once saved). */
export function estimateReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
