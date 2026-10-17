"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin gold line along the top edge that tracks how far down the page the reader is. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });

  if (reduce) return null;
  return (
    <m.div
      aria-hidden
      className="bg-gold-500 fixed inset-x-0 top-0 z-[70] h-0.5 origin-left"
      style={{ scaleX }}
    />
  );
}
