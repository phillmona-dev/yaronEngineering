"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** 2px brand progress bar pinned under the header. */
export function ReadingProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  if (reduce) return null;
  return (
    <m.div
      aria-hidden
      className="bg-brand fixed inset-x-0 top-[72px] z-40 h-0.5 origin-left lg:top-20"
      style={{ scaleX }}
    />
  );
}
