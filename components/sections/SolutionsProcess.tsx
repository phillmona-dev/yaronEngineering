"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { useSiteContent } from "@/lib/content/context";
import { Highlight } from "@/lib/content/highlight";

/**
 * "Technology Built Around Your Mission" — a sticky header beside a six-step rail whose
 * progress line fills as the reader scrolls. Vertical timeline on all breakpoints; sticky only on lg+.
 */
export function SolutionsProcess({
  showPillars = true,
  showCta = true,
}: {
  showPillars?: boolean;
  showCta?: boolean;
}) {
  const { solutions, home } = useSiteContent();
  const processSteps = solutions.steps;
  const tailoringPillars = solutions.pillars;
  const intro = home.sections.solutions;
  const railRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <Section theme="light" tone="soft" aria-labelledby="solutions-title">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeader
                eyebrow={intro.eyebrow}
                title={
                  <span id="solutions-title">
                    <Highlight text={intro.title} highlight={intro.highlight} />
                  </span>
                }
                lead={intro.lead}
              />
              {showCta && (
                <Reveal delay={0.2} className="mt-10">
                  <Button href="/solutions" variant="secondary">
                    {intro.ctaLabel}
                  </Button>
                </Reveal>
              )}
            </div>
          </div>

          <ol ref={railRef} className="relative lg:col-span-6 lg:col-start-7">
            {/* Rail */}
            <div
              aria-hidden
              className="bg-border-strong absolute top-0 bottom-0 left-[1.1rem] w-px lg:left-[1.4rem]"
            />
            <m.div
              aria-hidden
              className="bg-brand absolute top-0 bottom-0 left-[1.1rem] w-px origin-top lg:left-[1.4rem]"
              style={{ scaleY: reduce ? 1 : scaleY }}
            />
            {processSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.index}
                delay={0.04 * i}
                className="relative pl-14 lg:pl-20"
                amount={0.4}
              >
                <span
                  aria-hidden
                  className="border-border-strong bg-background text-muted-foreground font-label absolute top-1 left-0 flex size-9 items-center justify-center rounded-full border text-[0.7rem] font-semibold tracking-[0.14em] lg:size-11 lg:text-[0.7rem]"
                >
                  {step.index}
                </span>
                <div className={i < processSteps.length - 1 ? "pb-14 lg:pb-16" : undefined}>
                  <h3 className="text-h3 font-semibold">{step.title}</h3>
                  <p className="text-body text-foreground mt-2">{step.statement}</p>
                  <p className="text-body text-muted-foreground mt-4 max-w-[52ch]">{step.detail}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    {step.points.map((p) => (
                      <li key={p} className="text-foreground text-body flex items-center gap-2">
                        <span aria-hidden className="bg-brand size-1 rounded-full" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {showPillars && (
          <div className="border-border-strong mt-24 border-t pt-12 lg:mt-32">
            <Reveal>
              <p className="eyebrow">{intro.pillarsHeading}</p>
            </Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {tailoringPillars.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.title}
                  delay={0.05 * i}
                  className="border-border border-t py-6"
                >
                  <p className="text-muted-foreground font-label text-[0.7rem] font-semibold tracking-[0.14em]">
                    0{i + 1}
                  </p>
                  <p className="text-h4 mt-3 font-semibold">{p.title}</p>
                  <p className="text-muted-foreground text-body mt-2">{p.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
