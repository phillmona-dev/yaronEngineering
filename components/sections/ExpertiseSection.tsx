import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { Counter } from "@/components/animations/Counter";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { GridLines } from "@/components/ui/Backdrop";
import { leadershipRoles } from "@/lib/data/company";

export function ExpertiseSection() {
  return (
    <Section theme="dark" className="overflow-hidden" aria-labelledby="expertise-title">
      <GridLines className="text-white opacity-40" />
      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Experience &amp; expertise</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-stat mt-8 font-medium text-white">
                <Counter value={17} suffix="+" />
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <h2
                id="expertise-title"
                className="text-h2 mt-4 max-w-[20ch] font-semibold text-white"
              >
                Years of engineering leadership behind every design review.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lead text-ink-300 mt-6 max-w-[56ch]">
                The founding team brings more than 17 years of combined leadership experience,
                including contributions to Ethiopia&apos;s flagship digital transformation
                initiatives and ICT modernization programmes.
              </p>
            </Reveal>

            <StaggerGroup
              as="ul"
              className="border-border mt-12 grid grid-cols-1 border-t sm:grid-cols-2"
              stagger={0.06}
            >
              {leadershipRoles.map((role, i) => (
                <StaggerItem
                  as="li"
                  key={role}
                  className="border-border text-ink-100 flex items-start gap-4 border-b py-4 pr-6 text-[0.9375rem]"
                >
                  <span className="text-brand-300 pt-0.5 font-mono text-[0.66rem] tracking-[0.14em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {role}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <ClipReveal className="border-border aspect-[4/5] overflow-hidden rounded-md border">
              <ParallaxImage
                src="/images/photos/engineer-ethiopia.jpg"
                alt="Ethiopian engineer reviewing telemetry data beside enterprise server racks"
                sizes="(min-width: 1024px) 33vw, 100vw"
                containerClassName="h-full w-full"
                strength={0.07}
                className="saturate-[0.8]"
              />
            </ClipReveal>
            <Reveal delay={0.2} className="border-brand mt-6 border-l pl-5">
              <p className="text-ink-300 text-sm leading-relaxed">
                Leadership profiles and portraits will be published here once official team
                photography is supplied. We do not use stock or generated people.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
