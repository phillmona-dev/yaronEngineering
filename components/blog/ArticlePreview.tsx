import type { ArticleDetail } from "@/lib/blog/types";
import { CoverImage } from "./CoverImage";
import { ArticleMeta, Byline } from "./ArticleMeta";
import { ArticleRenderer } from "./ArticleRenderer";
import { TableOfContents } from "./TableOfContents";
import { ArticleCard } from "./ArticleCard";

/** Shared article body used by the authenticated admin preview (no tracking, no share, no newsletter). */
export function ArticlePreview({ article }: { article: ArticleDetail }) {
  return (
    <div data-theme="light" className="bg-background text-foreground">
      <div className="container-x pt-14">
        <ArticleMeta
          article={{ ...article, publishedAt: article.publishedAt ?? new Date().toISOString() }}
        />
        <h1 className="mt-6 max-w-[20ch] text-[clamp(2.25rem,1.4rem+3.2vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
          {article.title || "Untitled article"}
        </h1>
        <p className="text-body text-muted-foreground mt-6 max-w-[62ch]">{article.excerpt}</p>
        <Byline article={article} className="border-border mt-6 border-t pt-6" />
        <div className="mt-10">
          <CoverImage
            media={article.coverImage}
            sizes="100vw"
            className="aspect-[21/9] rounded-md"
          />
        </div>
      </div>
      <div className="container-x py-14">
        <div className="grid gap-10 xl:grid-cols-[180px_minmax(0,740px)_1fr] xl:gap-14">
          <div className="hidden xl:block" />
          <ArticleRenderer html={article.contentHtml} />
          <aside className="hidden xl:block">
            {article.toc.length > 1 && (
              <div className="sticky top-16">
                <TableOfContents items={article.toc} />
              </div>
            )}
          </aside>
        </div>
        {article.related.length > 0 && (
          <div className="border-border mt-20 border-t pt-12">
            <p className="eyebrow">Continue reading</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {article.related.slice(0, 3).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
