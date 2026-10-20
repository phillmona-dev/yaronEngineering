import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatDate, readingTime } from "@/lib/blog/format";
import type { ArticleSummary } from "@/lib/blog/types";

/** Mono metadata line: CATEGORY · date · reading time. */
export function ArticleMeta({
  article,
  className,
  showCategory = true,
}: {
  article: ArticleSummary;
  className?: string;
  showCategory?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-muted-foreground font-label flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold tracking-[0.14em] uppercase",
        className,
      )}
    >
      {showCategory && article.category && (
        <>
          <Link
            href={`/blog/category/${article.category.slug}`}
            className="text-brand-text hover:text-foreground transition-colors"
          >
            {article.category.name}
          </Link>
          <span aria-hidden className="bg-border-strong h-px w-4" />
        </>
      )}
      {article.publishedAt && (
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      )}
      <span aria-hidden>·</span>
      <span>{readingTime(article.readingTimeMinutes)}</span>
    </p>
  );
}

export function Byline({ article, className }: { article: ArticleSummary; className?: string }) {
  if (!article.author) return null;
  return (
    <p className={cn("text-body", className)}>
      <span className="text-muted-foreground">By </span>
      <Link
        href={`/blog/author/${article.author.slug}`}
        className="text-foreground hover:text-brand-text font-medium"
      >
        {article.author.name}
      </Link>
      {article.author.position && (
        <span className="text-muted-foreground"> · {article.author.position}</span>
      )}
    </p>
  );
}
