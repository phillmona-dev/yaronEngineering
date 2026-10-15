"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE_OUT_EXPO } from "@/lib/utils/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left";
};

/**
 * Reveals media via an animated clip-path mask.
 * Visibility is observed on an unclipped wrapper: browsers apply clip-path when computing
 * intersection, so observing the clipped element itself would never fire.
 */
export function ClipReveal({ children, className, delay = 0, direction = "up" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();
  const hidden = direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  const shown = "inset(0% 0% 0% 0%)";
  return (
    <div ref={ref} className={cn("relative", className)}>
      <m.div
        className="h-full w-full"
        initial={reduce ? { opacity: 0 } : { clipPath: hidden }}
        animate={inView ? (reduce ? { opacity: 1 } : { clipPath: shown }) : undefined}
        transition={{ duration: reduce ? 0.3 : 1.1, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </m.div>
    </div>
  );
}
