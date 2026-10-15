import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/blog/types";
import { CoverImage } from "./CoverImage";
import { ArticleMeta } from "./ArticleMeta";

/** Compact card for related / secondary lists. Border-only, no shadows. */
export function ArticleCard({ article }: { article: ArticleSummary }) {
  const href = `/blog/${article.slug}`;
  return (
    <article className="group border-border bg-surface hover:border-border-strong relative flex h-full flex-col overflow-hidden rounded-md border transition-colors duration-300">
      <span
        aria-hidden
        className="bg-brand ease-out-expo absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
      />
      <Link href={href} tabIndex={-1} aria-hidden>
        <CoverImage
          media={article.coverImage}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[16/10]"
          imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <ArticleMeta article={article} />
        <h3 className="text-h4 mt-3 font-semibold">
          <Link href={href} className="group-hover:text-brand-text transition-colors">
            {article.title}
          </Link>
        </h3>
        <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <span className="text-muted-foreground">{article.author?.name}</span>
          <ArrowUpRight
            className="text-muted-foreground group-hover:text-brand-text size-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}
