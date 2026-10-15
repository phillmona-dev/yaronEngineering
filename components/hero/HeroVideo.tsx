"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Props = {
  mp4: string;
  webm?: string;
  poster: string;
  posterAlt?: string;
  className?: string;
};

/**
 * Ambient hero video. The poster image renders first (and is the LCP element); the muted,
 * looping video fades in once it can play. Video is only requested on larger screens with
 * no reduced-motion or reduced-data preference, so phones keep the fast, lightweight image.
 */
export function HeroVideo({ mp4, webm, poster, posterAlt = "", className }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
        true || window.matchMedia("(prefers-reduced-data: reduce)").matches;
    if (wide && !saveData) setEnabled(true);
  }, [reduce]);

  useEffect(() => {
    const v = ref.current;
    if (!enabled || !v) return;
    const onReady = () => {
      setReady(true);
      v.play().catch(() => undefined);
    };
    if (v.readyState >= 3) onReady();
    else v.addEventListener("canplay", onReady, { once: true });
    return () => v.removeEventListener("canplay", onReady);
  }, [enabled]);

  return (
    <div className={cn("absolute inset-0", className)}>
      <Image
        src={poster}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
        quality={78}
        className={cn(
          "object-cover object-[60%_center] transition-opacity duration-1000",
          ready ? "opacity-0" : "opacity-100",
        )}
      />
      {enabled && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={poster}
          aria-hidden
          tabIndex={-1}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-[60%_center] transition-opacity duration-1000",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
