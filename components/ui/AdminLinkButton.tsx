"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Scroll offset after which the button appears, so it never covers the hero's CTAs. */
const SHOW_AFTER = 240;

/** Floating shortcut to the Knowledge Hub admin. Rendered on the home page only. */
export function AdminLinkButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <Link
      href="/admin"
      aria-label="Open the admin panel"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "group/admin bg-ink-950/80 ease-out-expo hover:bg-ink-950/95 focus-visible:ring-offset-background hover:border-gold-400/60 focus-visible:ring-gold-400 fixed bottom-8 left-20 z-[80] inline-flex h-12 items-center gap-2.5 rounded-full border border-white/15 pr-4 pl-3.5 text-[0.9375rem] font-semibold tracking-[-0.005em] text-white shadow-[0_10px_30px_-10px_rgba(14,34,80,0.6)] backdrop-blur-md transition-[transform,box-shadow,border-color,background,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-10px_rgba(245,197,24,0.55)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] max-sm:bottom-6 max-sm:left-16",
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-full text-white shadow-[0_4px_14px_-4px_rgba(245,197,24,0.7)]"
        style={{ background: "linear-gradient(135deg, #f5c518 0%, #fbd84a 50%, #d9a90c 100%)" }}
      >
        <ShieldCheck className="size-4" strokeWidth={2.25} />
      </span>
      <span>Admin Panel</span>
      <ArrowRight
        aria-hidden
        className="ease-out-expo text-gold-400 size-4 shrink-0 transition-transform duration-300 group-hover/admin:translate-x-1"
        strokeWidth={2}
      />
    </Link>
  );
}
