import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Credibility } from "@/components/sections/Credibility";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { Commitment } from "@/components/sections/Commitment";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { company, sectors } from "@/lib/data/company";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Founded in 2018 in Addis Ababa, Yaron Engineering PLC is an ICT infrastructure and cybersecurity consulting and system integration firm serving Ethiopia and East Africa.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <PageHero
        eyebrow="About Yaron Engineering"
        crumbs={[{ label: "About", href: "/about" }]}
        title={[
          <span key="a">A systems integrator built for</span>,
          <span key="b">
            <span className="text-gold-400">critical</span> infrastructure.
          </span>,
        ]}
        lead={`Founded in ${company.foundedMonth} ${company.founded} and headquartered in ${company.headquarters.city}, ${company.headquarters.country}.`}
        image={{
          src: "/images/photos/boardroom.jpg",
          alt: "Modern boardroom with glass walls",
        }}
      />

      <Credibility />

      <Section theme="light" aria-labelledby="story-title">
        <div className="container-x grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Our story</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="story-title" className="text-h2 mt-6 font-semibold">
                Founded with a bold, forward-looking vision.
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
            {company.story.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className={i === 0 ? "text-lead" : "text-body text-muted-foreground"}>{p}</p>
              </Reveal>
            ))}
            <Reveal
              delay={0.15}
              className="border-border mt-4 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4"
            >
              {sectors.map((s) => (
                <div key={s} className="flex flex-col gap-2">
                  <span aria-hidden className="bg-gold-500 h-px w-5" />
                  <span className="text-sm font-medium">{s}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </Section>

      <Section theme="dark" aria-labelledby="vision-title">
        <div className="container-x grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ClipReveal className="border-border aspect-[4/3] overflow-hidden rounded-md border">
              <ParallaxImage
                src="/images/photos/hero-datacenter.jpg"
                alt="Data center aisle with illuminated server racks"
                sizes="(min-width: 1024px) 50vw, 100vw"
                containerClassName="h-full w-full"
                strength={0.06}
              />
            </ClipReveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Eyebrow>Vision</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="vision-title" className="text-h3 mt-6 font-semibold text-white">
                {company.vision}
              </h2>
            </Reveal>
            <Reveal delay={0.16} className="mt-12">
              <Eyebrow>Core values</Eyebrow>
            </Reveal>
            <StaggerGroup as="ul" className="border-border mt-6 border-t" stagger={0.06}>
              {company.coreValues.map((v, i) => (
                <StaggerItem
                  as="li"
                  key={v}
                  className="border-border text-ink-100 flex items-start gap-4 border-b py-4 text-[0.9375rem]"
                >
                  <span className="text-gold-400 pt-0.5 font-mono text-[0.66rem] tracking-[0.14em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {v}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Section>

      <ExpertiseSection />
      <Commitment />
      <FinalCTA />
    </>
  );
}
