"use client";

import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * Brand ornament for the hero: concentric orbit rings with travelling nodes, echoing the
 * circuit traces in the Yaron shield. Pure SVG, no photography. Rings rotate very slowly;
 * under reduced motion they stay still.
 */
const RINGS = [
  { r: 150, dash: "2 10", width: 1, speed: 90, nodes: 3, color: "#a6ccf7" },
  { r: 240, dash: "1 14", width: 1, speed: 140, nodes: 4, color: "#6ca6ee" },
  { r: 330, dash: "3 18", width: 1.2, speed: 200, nodes: 2, color: "#fbd84a" },
  { r: 420, dash: "1 22", width: 0.8, speed: 260, nodes: 5, color: "#a6ccf7" },
];

export function HeroOrbits({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      aria-hidden
      viewBox="-460 -460 920 920"
      className={cn("pointer-events-none", className)}
      fill="none"
    >
      <defs>
        <radialGradient id="orbit-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#a6ccf7" stopOpacity="0.5" />
          <stop offset="1" stopColor="#3f82dc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="110" fill="url(#orbit-core)" />
      {RINGS.map((ring, i) => (
        <m.g
          key={ring.r}
          animate={reduce ? undefined : { rotate: i % 2 ? -360 : 360 }}
          transition={{ duration: ring.speed, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        >
          <circle
            r={ring.r}
            stroke={ring.color}
            strokeOpacity="0.55"
            strokeWidth={ring.width}
            strokeDasharray={ring.dash}
            strokeLinecap="round"
          />
          {Array.from({ length: ring.nodes }).map((_, n) => {
            const angle = (n / ring.nodes) * Math.PI * 2 + i;
            // Rounded so server and browser floating-point results serialise identically (no hydration diff).
            const x = Math.round(Math.cos(angle) * ring.r * 100) / 100;
            const y = Math.round(Math.sin(angle) * ring.r * 100) / 100;
            const gold = ring.color === "#fbd84a" || (i + n) % 3 === 0;
            return (
              <g key={n}>
                <circle cx={x} cy={y} r={gold ? 5 : 3.5} fill={gold ? "#f5c518" : "#ffffff"} />
                <circle
                  cx={x}
                  cy={y}
                  r={gold ? 11 : 8}
                  stroke={gold ? "#f5c518" : "#a6ccf7"}
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </m.g>
      ))}
    </svg>
  );
}
