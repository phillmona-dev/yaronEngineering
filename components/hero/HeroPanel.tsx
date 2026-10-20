"use client";

import { Network, Server, ShieldCheck, Cloud } from "lucide-react";
import { Counter } from "@/components/animations/Counter";
import { useSiteContent } from "@/lib/content/context";

const PILLARS = [
  { icon: Network, label: "Network" },
  { icon: Server, label: "Data center" },
  { icon: ShieldCheck, label: "Security" },
  { icon: Cloud, label: "Cloud" },
];

/** Glass capability panel shown beside the home-hero headline: the headline figure + four pillars. */
export function HeroPanel() {
  const { home } = useSiteContent();
  const projects = home.stats[0];
  const others = home.stats.slice(1, 4);

  return (
    <div className="grid gap-3">
      <div className="border-gold-500/35 relative overflow-hidden rounded-xl border bg-white/[0.08] p-6 shadow-[0_30px_80px_-30px_rgba(10,30,90,0.7)] backdrop-blur-xl sm:p-8">
        <div
          aria-hidden
          className="absolute -top-20 -right-20 size-56 rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(closest-side, rgba(245,197,24,0.45), transparent 70%)",
          }}
        />
        <p className="text-gold-300 font-label relative text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
          {home.hero.panelNote}
        </p>
        <p className="text-gold-400 font-display relative mt-3 text-[clamp(3.5rem,2rem+4vw,5.5rem)] leading-none font-bold tracking-[-0.03em]">
          <Counter value={projects.value} suffix={projects.suffix} />
        </p>
        <p className="text-ink-100 text-body relative mt-2">{home.hero.panelText}</p>

        <dl className="relative mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
          {others.map((s) => (
            <div key={s.label}>
              <dt className="text-ink-300 font-label text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
                {s.label}
              </dt>
              <dd className="font-display mt-1 text-xl font-bold text-white">
                <Counter value={s.value} suffix={s.suffix} plain={s.plain} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        {PILLARS.map((p) => (
          <li
            key={p.label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.1]"
          >
            <span className="bg-gold-500/15 grid size-8 shrink-0 place-items-center rounded-lg">
              <p.icon className="text-gold-400 size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="text-ink-100 text-body font-medium">{p.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
