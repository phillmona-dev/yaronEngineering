"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { services } from "@/lib/data/services";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { Glow } from "@/components/ui/Backdrop";
import { EASE_OUT_EXPO } from "@/lib/utils/motion";

/**
 * Interactive service index: a numbered list on the left, a sticky image panel on the right
 * that crossfades to the hovered/focused service. On mobile it becomes a horizontal snap rail.
 */
export function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <Section theme="dark" className="overflow-hidden" aria-labelledby="services-title">
      <Glow className="top-20 -right-40 h-[520px] w-[520px] opacity-50" />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Core competencies"
            title={
              <span id="services-title">
                Seven disciplines. <span className="text-brand-text">One</span> accountable team.
              </span>
            }
            lead="From the physical layer to the security operations center, we design, integrate and support the infrastructure organizations run on."
          />
          <Reveal delay={0.2} className="shrink-0">
            <Button href="/services" variant="secondary">
              All services
            </Button>
          </Reveal>
        </div>

        {/* Desktop: list + sticky panel */}
        <div className="mt-16 hidden gap-x-12 lg:grid lg:grid-cols-12">
          <ul className="border-border col-span-7 border-t" onMouseLeave={() => undefined}>
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.slug} className="border-border border-b">
                  <Link
                    href={`/services/${s.slug}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[3.5rem_1fr_auto] items-start gap-6 py-7 outline-none"
                  >
                    <span
                      className={cn(
                        "pt-1 font-mono text-[0.72rem] tracking-[0.14em] transition-colors duration-300",
                        isActive ? "text-brand-300" : "text-ink-400",
                      )}
                    >
                      {s.index}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "text-h3 block font-semibold transition-colors duration-300",
                          isActive ? "text-white" : "text-ink-300 group-hover:text-white",
                        )}
                      >
                        {s.title}
                      </span>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <m.span
                            key="desc"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                            className="block overflow-hidden"
                          >
                            <span className="text-ink-300 block max-w-[52ch] pt-3 text-[0.9375rem] leading-relaxed">
                              {s.summary}
                            </span>
                            <span className="mt-4 flex flex-wrap gap-2">
                              {s.capabilities.map((c) => (
                                <span
                                  key={c}
                                  className="border-border text-ink-300 rounded-sm border px-2 py-1 font-mono text-[0.66rem] tracking-[0.1em] uppercase"
                                >
                                  {c}
                                </span>
                              ))}
                            </span>
                          </m.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span
                      className={cn(
                        "mt-1 flex size-10 items-center justify-center rounded-sm border transition-all duration-300",
                        isActive
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-border text-ink-400 group-hover:border-ink-500",
                      )}
                    >
                      <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="col-span-5">
            <div className="border-border bg-ink-900 sticky top-28 aspect-[4/5] overflow-hidden rounded-md border">
              <AnimatePresence mode="sync">
                <m.div
                  key={current.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                >
                  <Image
                    src={current.image.src}
                    alt={current.image.alt}
                    fill
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    className="object-cover"
                  />
                </m.div>
              </AnimatePresence>
              <div aria-hidden className="image-overlay absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7">
                <div>
                  <p className="text-ink-300 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
                    {current.theme}
                  </p>
                  <p className="text-h4 mt-2 font-semibold text-white">{current.shortTitle}</p>
                </div>
                <current.icon className="text-brand-300 size-6" strokeWidth={1.25} aria-hidden />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: horizontal rail */}
        <div className="-mx-5 mt-12 sm:-mx-8 lg:hidden">
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8">
            {services.map((s) => (
              <li key={s.slug} className="w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[46vw]">
                <Link
                  href={`/services/${s.slug}`}
                  className="group border-border bg-ink-900 flex h-full flex-col overflow-hidden rounded-md border"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={s.image.src}
                      alt={s.image.alt}
                      fill
                      sizes="80vw"
                      className="object-cover"
                    />
                    <div aria-hidden className="image-overlay absolute inset-0" />
                    <span className="text-ink-200 absolute top-4 left-4 font-mono text-[0.68rem] tracking-[0.14em]">
                      {s.index}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="text-h4 font-semibold text-white">{s.title}</p>
                    <p className="text-ink-300 text-sm leading-relaxed">{s.summary}</p>
                    <span className="text-brand-300 mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium">
                      Learn more
                      <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
