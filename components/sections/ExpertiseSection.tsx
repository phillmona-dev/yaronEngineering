import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { Counter } from "@/components/animations/Counter";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { GridLines } from "@/components/ui/Backdrop";
import { getSiteContent } from "@/lib/content/server";

export async function ExpertiseSection() {
  const { about } = await getSiteContent();
  const leadershipRoles = about.leadershipRoles;
  const copy = about.expertise;
  return (
    <Section theme="dark" className="overflow-clip" aria-labelledby="expertise-title">
      <GridLines className="text-white opacity-40" />
      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{copy.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-stat font-display mt-8 font-bold text-white">
                <Counter value={copy.years} suffix="+" />
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <h2
                id="expertise-title"
                className="text-h2 mt-4 max-w-[20ch] font-semibold text-white"
              >
                {copy.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-body text-ink-300 mt-6 max-w-[56ch]">{copy.lead}</p>
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
                  className="border-border text-ink-100 text-body flex items-start gap-4 border-b py-4 pr-6"
                >
                  <span className="text-gold-400 font-label pt-0.5 text-[0.7rem] font-semibold tracking-[0.14em]">
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
                src="/images/photos/hero-video-poster.jpg"
                alt="Enterprise server racks in a data center aisle"
                sizes="(min-width: 1024px) 33vw, 100vw"
                containerClassName="h-full w-full"
                strength={0.07}
                duotone
              />
            </ClipReveal>
            <Reveal delay={0.2} className="border-brand mt-6 border-l pl-5">
              <p className="text-ink-300 text-body">{copy.note}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
