"use client";

import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE_OUT_EXPO, viewportOnce } from "@/lib/utils/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  as?: "div" | "span" | "li" | "article" | "figure";
  once?: boolean;
  amount?: number;
};

/** Scroll-triggered fade-up reveal with a soft de-blur. Falls back to an instant opacity change under reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  y = 24,
  as = "div",
  once = true,
  amount,
}: Props) {
  const reduce = useReducedMotion();
  const Tag = m[as];
  return (
    <Tag
      className={cn(className)}
      initial={{ opacity: 0, y: reduce ? 0 : y, filter: reduce ? "blur(0px)" : "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ ...viewportOnce, once, amount: amount ?? viewportOnce.amount }}
      transition={{ duration: reduce ? 0.2 : duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  );
}
