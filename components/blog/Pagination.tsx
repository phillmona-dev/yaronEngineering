import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (p: number) => string;
}) {
  if (totalPages <= 1) return null;
  const btn =
    "inline-flex h-10 items-center gap-2 rounded-sm border border-border px-4 text-body font-medium transition-colors hover:border-foreground";
  return (
    <nav
      aria-label="Pagination"
      className="border-border mt-12 flex items-center justify-between border-t pt-6"
    >
      {page > 0 ? (
        <Link href={hrefFor(page - 1)} className={btn}>
          <ArrowLeft className="size-4" aria-hidden /> Newer
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted-foreground font-label text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
        Page {page + 1} of {totalPages}
      </span>
      {page + 1 < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(btn)}>
          Older <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
