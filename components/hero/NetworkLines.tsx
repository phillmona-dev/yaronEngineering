"use client";

import { m, useReducedMotion } from "framer-motion";

/**
 * Decorative network topology: thin paths drawn in over time, nodes pulsing softly.
 * Rendered at low opacity behind hero content. Hidden under reduced motion (static instead).
 */
const PATHS = [
  "M 40 420 L 260 420 L 340 340 L 620 340 L 700 260 L 1100 260",
  "M 120 560 L 420 560 L 520 460 L 900 460 L 980 380 L 1240 380",
  "M 0 300 L 180 300 L 240 240 L 560 240 L 640 160 L 1020 160",
  "M 760 620 L 980 620 L 1060 540 L 1300 540",
];

const NODES = [
  [260, 420],
  [620, 340],
  [1100, 260],
  [420, 560],
  [900, 460],
  [240, 240],
  [640, 160],
  [1060, 540],
] as const;

export function NetworkLines({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      aria-hidden
      viewBox="0 0 1300 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="nl-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5b8be6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#8fb4f2" stopOpacity="0.9" />
          <stop offset="1" stopColor="#5b8be6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {PATHS.map((d, i) => (
        <m.path
          key={d}
          d={d}
          stroke="url(#nl-grad)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: reduce ? 0.3 : 2.6,
            delay: 0.6 + i * 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="2" fill="#8fb4f2" />
          {!reduce && (
            <m.circle
              cx={x}
              cy={y}
              r="6"
              stroke="#8fb4f2"
              strokeWidth="0.6"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.4, 1.6, 2.2] }}
              transition={{
                duration: 3.2,
                delay: 1.8 + i * 0.5,
                repeat: Infinity,
                repeatDelay: 2.4,
                ease: "easeOut",
              }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
