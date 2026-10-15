"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { NetworkLines } from "./NetworkLines";
import { HeroVideo } from "./HeroVideo";
import { company } from "@/lib/data/company";
import { EASE_OUT_EXPO } from "@/lib/utils/motion";

const DATA_POINTS = [
  { label: "HQ", value: "Addis Ababa · 9.02°N 38.83°E" },
  { label: "Est.", value: "2018" },
  { label: "Focus", value: "ICT Infrastructure · Cybersecurity" },
];

export function HomeHero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 900], [0, 120]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const contentY = useTransform(scrollY, [0, 500], [0, 60]);

  return (
    <section
      data-theme="dark"
      className="bg-ink-950 text-foreground relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
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
            background: "radial-gradient(closest-side, rgba(47,98,198,0.35), transparent 70%)",
          }}
        />
        <NetworkLines className="absolute inset-0 h-full w-full opacity-[0.55] mix-blend-screen" />
        <div aria-hidden className="grid-lines absolute inset-0 text-white opacity-50" />
      </m.div>

      {/* Content */}
      <m.div
        className="container-x relative pt-40 pb-16 sm:pb-20 lg:pb-24"
        style={reduce ? undefined : { opacity: contentOpacity, y: contentY }}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-9 xl:col-span-8">
            <m.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
              className="eyebrow text-ink-300 mb-7 flex items-center gap-3"
            >
              <span className="relative flex size-2">
                <span className="animate-pulse-soft bg-brand-400 absolute inset-0 rounded-full" />
                <span className="bg-brand-300 relative size-2 rounded-full" />
              </span>
              ICT Infrastructure &amp; Cybersecurity Systems Integrator
            </m.p>

            <TextReveal
              as="h1"
              delay={0.45}
              className="text-display font-semibold text-white"
              lines={[
                <span key="l1">Engineering the infrastructure</span>,
                <span key="l2">
                  behind a <span className="text-brand-300">secure</span> digital future.
                </span>,
              ]}
            />
            <div id="hero-title" className="sr-only">
              Engineering the infrastructure behind a secure digital future
            </div>

            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95, ease: EASE_OUT_EXPO }}
              className="text-lead text-ink-200 mt-8 max-w-[52ch]"
            >
              {company.shortName} delivers ICT infrastructure, cybersecurity, cloud, data center and
              enterprise technology solutions for organizations that cannot afford to compromise.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE_OUT_EXPO }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <MagneticButton>
                <Button href="/solutions" size="lg">
                  Explore Our Solutions
                </Button>
              </MagneticButton>
              <Button href="/contact" size="lg" variant="secondary" arrow={false}>
                Talk to Our Experts
              </Button>
            </m.div>
          </div>

          {/* Technical data points */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
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
        </div>
      </m.div>
    </section>
  );
}
