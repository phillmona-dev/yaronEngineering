import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  text,
  action,
  className,
}: {
  title: string;
  text: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border-strong rounded-md border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      <p className="text-muted-foreground font-mono text-[0.68rem] tracking-[0.16em] uppercase">
        Nothing here yet
      </p>
      <p className="text-h4 mt-3 font-semibold">{title}</p>
      <p className="text-muted-foreground mx-auto mt-2 max-w-[48ch] text-sm">{text}</p>
      {action && (
        <Link
          href={action.href}
          className="border-border-strong hover:border-foreground mt-6 inline-flex h-10 items-center rounded-sm border px-4 text-sm font-medium"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function UnavailableState({ className }: { className?: string }) {
  return (
    <div
      className={cn("border-border bg-surface rounded-md border px-6 py-14 text-center", className)}
      role="status"
    >
      <p className="text-muted-foreground font-mono text-[0.68rem] tracking-[0.16em] uppercase">
        Temporarily unavailable
      </p>
      <p className="text-h4 mt-3 font-semibold">The Knowledge Hub is taking a moment.</p>
      <p className="text-muted-foreground mx-auto mt-2 max-w-[48ch] text-sm">
        Our publishing service is not reachable right now. Please refresh in a minute.
      </p>
    </div>
  );
}

const sk = "animate-pulse rounded-sm bg-muted";

export function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12" aria-hidden>
      <div className={cn(sk, "aspect-[16/10] lg:col-span-7")} />
      <div className="flex flex-col justify-center gap-4 lg:col-span-5">
        <div className={cn(sk, "h-3 w-24")} />
        <div className={cn(sk, "h-10 w-full")} />
        <div className={cn(sk, "h-10 w-4/5")} />
        <div className={cn(sk, "h-4 w-full")} />
        <div className={cn(sk, "h-4 w-2/3")} />
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-border grid grid-cols-1 gap-5 border-t py-8 md:grid-cols-12 md:gap-8"
        >
          <div className={cn(sk, "aspect-[16/10] md:col-span-4")} />
          <div className="flex flex-col gap-3 md:col-span-8">
            <div className={cn(sk, "h-3 w-32")} />
            <div className={cn(sk, "h-7 w-3/4")} />
            <div className={cn(sk, "h-4 w-full")} />
            <div className={cn(sk, "h-4 w-1/2")} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="container-x py-32" aria-hidden>
      <div className={cn(sk, "h-3 w-28")} />
      <div className={cn(sk, "mt-6 h-12 w-full max-w-3xl")} />
      <div className={cn(sk, "mt-3 h-12 w-2/3 max-w-2xl")} />
      <div className={cn(sk, "mt-10 aspect-[21/9] w-full")} />
      <div className="mx-auto mt-12 flex max-w-[740px] flex-col gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={cn(sk, "h-4", i % 3 === 2 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}
