"use client";

import { m, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/utils/motion";

/** Re-mounts on every navigation so each page eases in instead of snapping. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
    >
      {children}
    </m.div>
  );
}
