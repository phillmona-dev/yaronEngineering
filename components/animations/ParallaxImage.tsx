"use client";

import { useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Props = Omit<ImageProps, "fill"> & {
  /** Parallax travel as a fraction of container height (0.06 = 6 %). */
  strength?: number;
  containerClassName?: string;
  /** Set when the container is positioned by the caller (e.g. `absolute inset-0`). */
  absolute?: boolean;
  overlay?: boolean;
  zoomOnHover?: boolean;
  /** Blue duotone treatment for photos inside dark sections (see globals.css). */
  duotone?: boolean;
};

/** Image with subtle scroll parallax and optional clip reveal. Always wrapped in an aspect/size container. */
export function ParallaxImage({
  strength = 0.08,
  containerClassName,
  absolute = false,
  className,
  overlay,
  zoomOnHover,
  duotone,
  alt,
  priority,
  ...img
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-strength * 100}%`, `${strength * 100}%`]);

  return (
    <div
      ref={ref}
      className={cn(
        "group/media overflow-hidden",
        absolute ? "absolute inset-0" : "relative",
        containerClassName,
      )}
    >
      <m.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale: 1 + strength * 2.2 }}
      >
        <Image
          alt={alt}
          fill
          priority={priority}
          className={cn(
            "ease-out-expo object-cover transition-transform duration-700",
            zoomOnHover && "group-hover/media:scale-[1.03]",
            duotone && "duotone-media",
            className,
          )}
          {...img}
        />
      </m.div>
      {duotone && (
        <>
          <div aria-hidden className="duotone-shadows pointer-events-none absolute inset-0" />
          <div aria-hidden className="duotone-lights pointer-events-none absolute inset-0" />
        </>
      )}
      {overlay && <div aria-hidden className="image-overlay absolute inset-0" />}
    </div>
  );
}
