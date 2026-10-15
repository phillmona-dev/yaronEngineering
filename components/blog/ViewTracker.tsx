"use client";

import { useEffect } from "react";

/** Records one view per article per session after the reader has stayed 8 s (not a blind refresh counter). */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `yaron-view:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => {
      fetch(`/api/blog/view/${encodeURIComponent(slug)}`, {
        method: "POST",
        keepalive: true,
      }).catch(() => undefined);
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [slug]);
  return null;
}
