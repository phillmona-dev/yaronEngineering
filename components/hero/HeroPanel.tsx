"use client";

import Image from "next/image";
import { Network, Server, ShieldCheck, Cloud } from "lucide-react";
import { Counter } from "@/components/animations/Counter";
import { stats } from "@/lib/data/company";

const PILLARS = [
  { icon: Network, label: "Network" },
  { icon: Server, label: "Data center" },
  { icon: ShieldCheck, label: "Security" },
  { icon: Cloud, label: "Cloud" },
];

/** Glass capability panel shown beside the home-hero headline. */
export function HeroPanel() {
  const projects = stats[0];

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="border-gold-500/30 bg-ink-900/60 col-span-2 rounded-lg border p-6 backdrop-blur-md sm:p-8">
        <p className="text-gold-400 font-mono text-[0.66rem] tracking-[0.16em] uppercase">
          {projects.note}
        </p>
        <p className="text-gold-400 mt-3 text-[clamp(3.5rem,2rem+4vw,5.5rem)] leading-none font-semibold tracking-[-0.04em]">
          <Counter value={projects.value} suffix={projects.suffix} />
        </p>
        <p className="text-ink-200 mt-2 text-sm">
          {projects.label} for government, finance and enterprise.
        </p>
      </div>

      <ul className="bg-ink-900/60 col-span-2 grid grid-cols-4 divide-x divide-white/10 rounded-lg border border-white/10 backdrop-blur-md sm:col-span-1 sm:grid-cols-2 sm:divide-x-0 sm:divide-y">
        {PILLARS.map((p) => (
          <li
            key={p.label}
            className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:gap-3"
          >
            <p.icon className="text-gold-400 size-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="text-ink-100 text-xs font-medium sm:text-sm">{p.label}</span>
          </li>
        ))}
      </ul>

      <div className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-lg border border-white/10 sm:col-span-1 sm:aspect-auto">
        <Image
          src="/images/photos/hero-video-poster.jpg"
          alt="Data center aisle with illuminated server racks"
          fill
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="object-cover"
          priority
        />
        <div
          aria-hidden
          className="from-ink-950/80 absolute inset-0 bg-gradient-to-t to-transparent"
        />
        <p className="text-ink-100 absolute bottom-3 left-3 font-mono text-[0.62rem] tracking-[0.14em] uppercase">
          Data center floor
        </p>
      </div>
    </div>
  );
}
