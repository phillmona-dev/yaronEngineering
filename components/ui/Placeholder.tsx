import { cn } from "@/lib/utils/cn";

/** Clearly marked placeholder for information not yet supplied by the company. */
export function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "border-border-strong text-muted-foreground font-label inline-flex items-center rounded-sm border border-dashed px-2 py-0.5 text-[0.7rem] font-semibold tracking-[0.08em]",
        className,
      )}
      title="Placeholder — awaiting official information"
    >
      [{label}]
    </span>
  );
}
