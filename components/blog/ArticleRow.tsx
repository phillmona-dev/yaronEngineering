import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/blog/types";
import { CoverImage } from "./CoverImage";
import { ArticleMeta, Byline } from "./ArticleMeta";
import { cn } from "@/lib/utils/cn";

/** Editorial list row: image 4 / text 8. Hover grows an accent rule and moves the arrow. */
export function ArticleRow({
  article,
  index,
  className,
}: {
  article: ArticleSummary;
  index?: number;
  className?: string;
}) {
  const href = `/blog/${article.slug}`;
  return (
    <article
      className={cn(
        "group border-border relative grid grid-cols-1 gap-5 border-t py-8 md:grid-cols-12 md:gap-8 lg:py-10",
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-brand ease-out-expo absolute top-0 left-0 h-px w-0 transition-[width] duration-500 group-hover:w-full"
      />
      <Link href={href} tabIndex={-1} aria-hidden className="md:col-span-4">
        <CoverImage
          media={article.coverImage}
          sizes="(min-width: 768px) 30vw, 100vw"
          className="aspect-[16/10] rounded-md"
          imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-col md:col-span-8 md:flex-row md:gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {typeof index === "number" && (
              <span className="text-muted-foreground font-mono text-[0.68rem] tracking-[0.14em]">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <ArticleMeta article={article} />
          </div>
          <h3 className="text-h3 mt-3 max-w-[26ch] font-semibold">
            <Link
              href={href}
              className="group-hover:text-brand-text focus-visible:text-brand-text transition-colors duration-300"
            >
              {article.title}
            </Link>
          </h3>
          {article.highlight ? (
            <p
              className="search-highlight text-body text-muted-foreground mt-3 max-w-[60ch]"
              dangerouslySetInnerHTML={{ __html: article.highlight }}
            />
          ) : (
            <p className="text-body text-muted-foreground mt-3 max-w-[60ch]">{article.excerpt}</p>
          )}
          <Byline article={article} className="mt-5" />
        </div>
        <Link
          href={href}
          aria-label={`Read ${article.title}`}
          className="border-border text-muted-foreground group-hover:border-brand group-hover:bg-brand mt-5 flex size-10 shrink-0 items-center justify-center self-start rounded-sm border transition-all duration-300 group-hover:text-white md:mt-1"
        >
          <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
