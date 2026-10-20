import { cn } from "@/lib/utils/cn";

export function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "border-border text-muted-foreground font-label inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.14em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
