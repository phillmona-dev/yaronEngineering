import { cn } from "@/lib/utils/cn";

export function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "border-border text-muted-foreground inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.12em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
