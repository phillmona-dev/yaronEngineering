"use client";

import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE_OUT_EXPO } from "@/lib/utils/motion";

type Props = {
  /** Lines are rendered as separate masked rows so they rise independently. */
  lines: React.ReactNode[];
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
};

/** Line-by-line masked text reveal for headlines. */
export function TextReveal({
  lines,
  as: Tag = "h1",
  className,
  delay = 0,
  stagger = 0.11,
  inView = false,
}: Props) {
  const reduce = useReducedMotion();
  const triggers = inView
    ? { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } }
    : { animate: "visible" as const };
  return (
    <Tag className={cn(className)}>
      <m.span
        className="block"
        initial="hidden"
        {...triggers}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {lines.map((line, i) => (
          <span key={i} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
            <m.span
              className="block will-change-transform"
              variants={{
                hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: reduce ? 0.2 : 0.9, ease: EASE_OUT_EXPO },
                },
              }}
            >
              {line}
            </m.span>
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
