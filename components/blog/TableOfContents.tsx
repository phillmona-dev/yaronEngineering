"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { TocItem } from "@/lib/blog/types";

export function TableOfContents({
  items,
  variant = "sidebar",
}: {
  items: TocItem[];
  variant?: "sidebar" | "inline";
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;

  const list = (
    <ol className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={() => setOpen(false)}
            className={cn(
              "block border-l py-1.5 text-[0.8125rem] leading-snug transition-colors duration-200",
              item.level === 3 ? "pl-7" : "pl-4",
              active === item.id
                ? "border-brand text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
            aria-current={active === item.id ? "location" : undefined}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "inline") {
    return (
      <div className="border-border bg-surface rounded-md border">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="text-muted-foreground flex w-full items-center justify-between px-4 py-3 font-mono text-[0.68rem] tracking-[0.14em] uppercase"
        >
          On this page
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
        {open && <div className="border-border border-t px-4 py-3">{list}</div>}
      </div>
    );
  }

  return (
    <nav aria-label="On this page">
      <p className="text-muted-foreground mb-4 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
        On this page
      </p>
      {list}
    </nav>
  );
}
