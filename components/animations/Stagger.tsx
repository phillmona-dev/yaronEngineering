"use client";

import { m, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO, viewportOnce } from "@/lib/utils/motion";

type GroupProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol";
  amount?: number;
};

export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0.05,
  as = "div",
  amount,
}: GroupProps) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, amount: amount ?? viewportOnce.amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Tag>
  );
}

type ItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  y?: number;
};

export function StaggerItem({ children, className, as = "div", y = 20 }: ItemProps) {
  const reduce = useReducedMotion();
  const Tag = m[as];
  return (
    <Tag
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: reduce ? 0 : y,
          scale: reduce ? 1 : 0.96,
          filter: reduce ? "blur(0px)" : "blur(6px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.75, ease: EASE_OUT_EXPO },
        },
      }}
    >
      {children}
    </Tag>
  );
}
