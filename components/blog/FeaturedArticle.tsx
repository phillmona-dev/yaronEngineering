import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/blog/types";
import { CoverImage } from "./CoverImage";
import { ArticleMeta, Byline } from "./ArticleMeta";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { Reveal } from "@/components/animations/Reveal";

/** Hero story. Image dominates (7/12), text column sits beside it. */
export function FeaturedArticle({
  article,
  eyebrow = "Featured",
  priority = true,
}: {
  article: ArticleSummary;
  eyebrow?: string;
  priority?: boolean;
}) {
  const href = `/blog/${article.slug}`;
  return (
    <article className="group grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <Link
        href={href}
        className="relative block lg:col-span-7"
        aria-label={article.title}
        tabIndex={-1}
      >
        <ClipReveal className="aspect-[16/10] overflow-hidden rounded-md">
          <CoverImage
            media={article.coverImage}
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority={priority}
            className="h-full w-full"
            imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
        </ClipReveal>
      </Link>
      <div className="flex flex-col justify-center lg:col-span-5">
        <Reveal>
          <p className="text-brand-text flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.16em] uppercase">
            <span aria-hidden className="bg-gold-500 h-px w-6" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <ArticleMeta article={article} className="mt-5" />
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="text-h2 mt-4 font-semibold">
            <Link
              href={href}
              className="group-hover:text-brand-text focus-visible:text-brand-text transition-colors duration-300"
            >
              {article.title}
            </Link>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="text-lead text-muted-foreground mt-5 max-w-[48ch]">{article.excerpt}</p>
        </Reveal>
        <Reveal
          delay={0.24}
          className="border-border mt-7 flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <Byline article={article} />
          <Link
            href={href}
            className="text-foreground inline-flex items-center gap-2 text-sm font-medium"
          >
            Read article
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.75}
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
