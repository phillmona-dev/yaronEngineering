"use client";

import { useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Props = Omit<ImageProps, "fill"> & {
  /** Parallax travel as a fraction of container height (0.06 = 6 %). */
  strength?: number;
  containerClassName?: string;
  overlay?: boolean;
  zoomOnHover?: boolean;
};

/** Image with subtle scroll parallax and optional clip reveal. Always wrapped in an aspect/size container. */
export function ParallaxImage({
  strength = 0.08,
  containerClassName,
  className,
  overlay,
  zoomOnHover,
  alt,
  ...img
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-strength * 100}%`, `${strength * 100}%`]);

  return (
    <div ref={ref} className={cn("group/media relative overflow-hidden", containerClassName)}>
      <m.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale: 1 + strength * 2.2 }}
      >
        <Image
          alt={alt}
          fill
          className={cn(
            "ease-out-expo object-cover transition-transform duration-700",
            zoomOnHover && "group-hover/media:scale-[1.03]",
            className,
          )}
          {...img}
        />
      </m.div>
      {overlay && <div aria-hidden className="image-overlay absolute inset-0" />}
    </div>
  );
}
