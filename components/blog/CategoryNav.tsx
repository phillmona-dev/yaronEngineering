import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/lib/blog/types";

export function CategoryNav({
  categories,
  active,
  className,
}: {
  categories: Category[];
  active?: string;
  className?: string;
}) {
  if (!categories.length) return null;
  return (
    <nav aria-label="Categories" className={cn("-mx-5 sm:-mx-8 lg:mx-0", className)}>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto px-5 sm:px-8 lg:flex-wrap lg:px-0">
        <li>
          <Link
            href="/blog"
            aria-current={!active ? "page" : undefined}
            className={cn(
              "text-body inline-flex h-9 items-center rounded-sm border px-3.5 whitespace-nowrap transition-colors",
              !active
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            All
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/blog/category/${c.slug}`}
              aria-current={active === c.slug ? "page" : undefined}
              className={cn(
                "text-body inline-flex h-9 items-center gap-2 rounded-sm border px-3.5 whitespace-nowrap transition-colors",
                active === c.slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {c.name}
              {typeof c.articleCount === "number" && c.articleCount > 0 && (
                <span className="font-label text-[0.7rem] font-semibold opacity-70">
                  {c.articleCount}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
