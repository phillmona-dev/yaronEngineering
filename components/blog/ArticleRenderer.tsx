import { cn } from "@/lib/utils/cn";

/**
 * Renders backend-sanitized article HTML. The backend is the single sanitization boundary
 * (OWASP policy) — the frontend never renders unsanitized editor output.
 */
export function ArticleRenderer({ html, className }: { html: string; className?: string }) {
  return (
    <div className={cn("prose-article", className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
