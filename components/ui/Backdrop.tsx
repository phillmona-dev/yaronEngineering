import { cn } from "@/lib/utils/cn";

/** Low-opacity technical background layers. Purely decorative. */
export function GridLines({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("grid-lines pointer-events-none absolute inset-0", className)} />
  );
}

export function Glow({
  className,
  color = "rgba(63,130,220,0.35)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{ background: `radial-gradient(closest-side, ${color}, transparent 70%)` }}
    />
  );
}

export function DotGrid({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("dot-grid pointer-events-none absolute inset-0", className)} />
  );
}
