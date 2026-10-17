"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { NetworkLines } from "./NetworkLines";
import { HeroVideo } from "./HeroVideo";
import { HeroPanel } from "./HeroPanel";
import { company } from "@/lib/data/company";
import { customers } from "@/lib/data/customers";
import { EASE_OUT_EXPO } from "@/lib/utils/motion";

const DATA_POINTS = [
  { label: "HQ", value: "Addis Ababa · 9.02°N 38.83°E" },
  { label: "Est.", value: "2018" },
  { label: "Focus", value: "ICT Infrastructure · Cybersecurity" },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE_OUT_EXPO },
});

export function HomeHero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 900], [0, 120]);
  const panelY = useTransform(scrollY, [0, 900], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const contentY = useTransform(scrollY, [0, 500], [0, 60]);

  return (
    <section
      data-theme="dark"
      className="bg-ink-950 text-foreground relative isolate overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Visual layer */}
      <m.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: imgY }}>
        <m.div
          className="absolute inset-0"
          initial={{ scale: reduce ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE_OUT_EXPO }}
        >
          <HeroVideo
            mp4="/videos/hero-datacenter.mp4"
            webm="/videos/hero-datacenter.webm"
            poster="/images/photos/hero-video-poster.jpg"
          />
        </m.div>
        {/* Blue duotone wash so the footage reads as brand, not stock */}
        <div aria-hidden className="bg-brand-700/40 absolute inset-0 mix-blend-multiply" />
        <div
          aria-hidden
          className="from-ink-950 via-ink-950/75 to-ink-950/35 absolute inset-0 bg-gradient-to-t"
        />
        <div
          aria-hidden
          className="from-ink-950/85 via-ink-950/30 absolute inset-0 bg-gradient-to-r to-transparent"
        />
        <div
          aria-hidden
          className="absolute top-[30%] -left-[10%] h-[60vh] w-[60vw] rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(closest-side, rgba(63,130,220,0.4), transparent 70%)",
          }}
        />
        <NetworkLines className="absolute inset-0 h-full w-full opacity-[0.55] mix-blend-screen" />
        <div aria-hidden className="grid-lines absolute inset-0 text-white opacity-50" />
        {/* Gold diagonal hairline — the logo's circuit trace, abstracted */}
        <div
          aria-hidden
          className="from-gold-500/0 via-gold-500/45 to-gold-500/0 absolute top-0 right-[38%] hidden h-[140%] w-px origin-top rotate-[22deg] bg-gradient-to-b lg:block"
        />
      </m.div>

      {/* Content */}
      <m.div
        className="container-x relative grid min-h-[100svh] grid-cols-1 items-end gap-x-10 gap-y-14 pt-36 pb-14 lg:grid-cols-12 lg:items-center lg:pt-32 lg:pb-16"
        style={reduce ? undefined : { opacity: contentOpacity, y: contentY }}
      >
        {/* Copy */}
        <div className="lg:col-span-7">
          <m.p
            {...fade(0.25)}
            className="border-gold-500/40 bg-gold-500/10 text-gold-300 inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase"
          >
            <span className="relative flex size-1.5">
              <span className="animate-pulse-soft bg-gold-400 absolute inset-0 rounded-full" />
              <span className="bg-gold-500 relative size-1.5 rounded-full" />
            </span>
            ICT Infrastructure &amp; Cybersecurity Systems Integrator
          </m.p>

          <TextReveal
            as="h1"
            delay={0.4}
            className="mt-8 text-[clamp(2.75rem,1.2rem+4.4vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-white"
            lines={[
              <span key="l1">Engineering the</span>,
              <span key="l2">infrastructure</span>,
              <span key="l3">
                behind a <span className="text-gold-400">secure</span>
              </span>,
              <span key="l4">digital future.</span>,
            ]}
          />
          <div id="hero-title" className="sr-only">
            Engineering the infrastructure behind a secure digital future
          </div>

          <m.p {...fade(0.9)} className="text-lead text-ink-200 mt-8 max-w-[50ch]">
            {company.shortName} delivers ICT infrastructure, cybersecurity, cloud, data center and
            enterprise technology solutions for organizations that cannot afford to compromise.
          </m.p>

          <m.div
            {...fade(1.05)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <MagneticButton>
              <Button href="/solutions" size="lg">
                Explore Our Solutions
              </Button>
            </MagneticButton>
            <Button href="/contact" size="lg" variant="secondary" arrow="up">
              Talk to Our Experts
            </Button>
          </m.div>

          {/* Trust row */}
          <m.div {...fade(1.3)} className="mt-12 border-t border-white/10 pt-6">
            <p className="text-ink-400 font-mono text-[0.66rem] tracking-[0.16em] uppercase">
              Trusted by
            </p>
            <ul className="mt-4 flex flex-wrap items-center gap-3">
              {customers.slice(0, 5).map((c) => (
                <li
                  key={c.id}
                  className="rounded-md bg-white/90 px-3 py-2 opacity-90 transition-opacity hover:opacity-100"
                >
                  <Image src={c.logo} alt={c.name} width={120} height={40} className="h-7 w-auto" />
                </li>
              ))}
            </ul>
          </m.div>
        </div>

        {/* Capability panel */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.7, ease: EASE_OUT_EXPO }}
          style={reduce ? undefined : { y: panelY }}
          className="lg:col-span-5"
        >
          <HeroPanel />
        </m.div>

        {/* Technical data points */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-ink-400 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-white/10 pt-6 font-mono text-[0.7rem] tracking-[0.14em] uppercase lg:col-span-12"
        >
          <dl className="flex flex-wrap gap-x-10 gap-y-3">
            {DATA_POINTS.map((d) => (
              <div key={d.label} className="flex gap-3">
                <dt className="text-ink-400">{d.label}</dt>
                <dd className="text-ink-300">{d.value}</dd>
              </div>
            ))}
          </dl>
          <div className="ml-auto hidden items-center gap-2 md:flex" aria-hidden>
            <ArrowDown
              className="size-3.5 animate-bounce [animation-duration:2.2s]"
              strokeWidth={1.5}
            />
            <span>Scroll</span>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
