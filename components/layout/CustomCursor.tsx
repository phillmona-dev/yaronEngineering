"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Minimal custom cursor: a 6px dot with a slow-following ring.
 * Only enabled on fine-pointer devices with hover and no reduced-motion preference.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 320, damping: 32, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 320, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    document.documentElement.dataset.cursor = "custom";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setHovering(
        Boolean(target?.closest("a, button, [role=button], input, textarea, select, label")),
      );
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      delete document.documentElement.dataset.cursor;
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      <m.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      />
      <m.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference"
        style={{ x: rx, y: ry }}
        animate={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          opacity: visible ? (hovering ? 0.9 : 0.5) : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
