import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Brand lock-up: the official shield mark (PNG supplied by the company) + a typographic wordmark.
 * To swap in an official SVG, replace `/public/images/brand/yaron-logo.png` and adjust `MARK` below.
 */
const MARK = "/images/brand/yaron-logo.png";

export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <Image
      src={MARK}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 select-none", className)}
      priority
    />
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3 rounded-sm", className)}>
      <LogoMark size={compact ? 32 : 38} />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-semibold tracking-[-0.02em] whitespace-nowrap">
          Yaron Engineering
        </span>
        {!compact && (
          <span className="text-muted-foreground mt-1 hidden font-mono text-[0.6rem] tracking-[0.18em] whitespace-nowrap uppercase sm:block">
            ICT Infrastructure · Cybersecurity
          </span>
        )}
      </span>
    </Link>
  );
}
