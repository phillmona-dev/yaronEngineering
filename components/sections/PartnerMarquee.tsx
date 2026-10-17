"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { Partner } from "@/lib/data/partners";

type Props = { partners: Partner[]; speed?: number; className?: string };

/**
 * Continuous right-to-left logo marquee. Two identical tracks scroll inside an overflow-hidden
 * rail so the loop is seamless; the rail pauses on hover/focus and fades at both edges.
 * Under reduced motion the logos render as a static wrapped grid instead.
 */
export function PartnerMarquee({ partners, speed = 55, className }: Props) {
  const reduce = useReducedMotion();
  const items = partners.filter((p) => p.logo);

  if (reduce) {
    return (
      <ul className={cn("flex flex-wrap items-center justify-center gap-x-14 gap-y-10", className)}>
        {items.map((p) => (
          <li key={p.name}>
            <LogoImage partner={p} />
          </li>
        ))}
      </ul>
    );
  }

  const duration = `${items.length * (60 / speed) * 3}s`;

  return (
    <div
      className={cn("group/marquee relative overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
      aria-label="Technology partners"
      role="region"
    >
      <div className="flex w-max" style={{ animation: `marquee ${duration} linear infinite` }}>
        {[0, 1].map((track) => (
          <ul
            key={track}
            aria-hidden={track === 1}
            className="flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24"
          >
            {items.map((p) => (
              <li key={`${track}-${p.name}`} className="shrink-0">
                <LogoImage partner={p} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function LogoImage({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/logo flex h-16 items-center lg:h-20"
      title={`${partner.name} · ${partner.category}`}
      aria-label={`Visit ${partner.name} official website`}
    >
      <div className="transition-[opacity,transform] duration-300 ease-out opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-125 group-hover/logo:-translate-y-2 will-change-transform">
        <Image
          src={partner.logo as string}
          alt={`${partner.name} logo`}
          width={240}
          height={120}
          sizes="240px"
          className="h-10 w-auto max-w-[170px] object-contain lg:h-14 lg:max-w-[230px]"
        />
      </div>
    </a>
  );
}

