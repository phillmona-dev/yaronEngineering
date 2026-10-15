import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SearchForm({
  defaultValue = "",
  size = "md",
  className,
  autoFocus,
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <form action="/blog/search" method="get" role="search" className={cn("relative", className)}>
      <label htmlFor="blog-search" className="sr-only">
        Search articles
      </label>
      <Search
        className={cn(
          "text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2",
          size === "lg" ? "size-5" : "size-4",
        )}
        aria-hidden
      />
      <input
        id="blog-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search articles, topics, technologies…"
        autoComplete="off"
        autoFocus={autoFocus}
        className={cn(
          "border-border-strong bg-background text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus-visible:ring-brand-hover/40 w-full rounded-sm border focus:outline-none focus-visible:ring-2",
          size === "lg" ? "h-14 pr-28 pl-12 text-lg" : "h-11 pr-24 pl-11 text-[0.9375rem]",
        )}
      />
      <button
        type="submit"
        className="bg-foreground text-background hover:bg-brand absolute top-1/2 right-2 h-8 -translate-y-1/2 rounded-sm px-4 text-sm font-medium transition-colors hover:text-white"
      >
        Search
      </button>
    </form>
  );
}
