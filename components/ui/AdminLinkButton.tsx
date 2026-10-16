import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

/** Floating shortcut to the Knowledge Hub admin. Rendered on the home page only. */
export function AdminLinkButton() {
  return (
    <Link
      href="/admin"
      aria-label="Open the admin panel"
      className="group/admin bg-ink-950/80 ease-out-expo hover:bg-ink-950/95 focus-visible:ring-offset-background fixed bottom-8 left-20 z-[80] inline-flex h-12 items-center gap-2.5 rounded-full border border-white/15 pr-4 pl-3.5 text-[0.9375rem] font-semibold tracking-[-0.005em] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[transform,box-shadow,border-color,background] duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:shadow-[0_14px_40px_-10px_rgba(255,110,0,0.55)] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] max-sm:bottom-6 max-sm:left-16"
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-full text-white shadow-[0_4px_14px_-4px_rgba(255,110,0,0.7)]"
        style={{ background: "linear-gradient(135deg, #ff8c00 0%, #ff6b00 50%, #e05500 100%)" }}
      >
        <ShieldCheck className="size-4" strokeWidth={2.25} />
      </span>
      <span>Admin Panel</span>
      <ArrowRight
        aria-hidden
        className="ease-out-expo size-4 shrink-0 text-orange-300 transition-transform duration-300 group-hover/admin:translate-x-1"
        strokeWidth={2}
      />
    </Link>
  );
}
