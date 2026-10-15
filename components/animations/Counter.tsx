"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  /** Render the number without digit grouping (e.g. years). */
  plain?: boolean;
  className?: string;
};

export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.6,
  plain,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = plain ? Math.max(0, value - 60) : 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce, plain]);

  const text = plain ? String(display) : display.toLocaleString("en-US");
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {prefix}
        {plain ? value : value.toLocaleString("en-US")}
        {suffix}
      </span>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {text}
        {suffix}
      </span>
    </span>
  );
}
