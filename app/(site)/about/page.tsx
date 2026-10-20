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
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { getSiteContent } from "@/lib/content/server";
import { pageHeroProps } from "@/lib/content/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return pageMetadata({
    title: pages.about.metaTitle,
    description: pages.about.metaDescription,
    path: "/about",
  });
}

export default async function AboutPage() {
  const { about, company, pages } = await getSiteContent();
  const sectors = about.sectors;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <PageHero {...pageHeroProps(pages.about)} crumbs={[{ label: "About", href: "/about" }]} />

      <Credibility />

      <Section theme="light" aria-labelledby="story-title">
        <div className="container-x grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Our story</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="story-title" className="text-h2 mt-6 font-semibold">
                {about.storyHeading}
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
            {about.story.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className={i === 0 ? "text-body" : "text-body text-muted-foreground"}>{p}</p>
              </Reveal>
            ))}
            <Reveal
              delay={0.15}
              className="border-border mt-4 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4"
            >
              {sectors.map((s) => (
                <div key={s} className="flex flex-col gap-2">
                  <span aria-hidden className="bg-gold-500 h-px w-5" />
                  <span className="text-body font-medium">{s}</span>
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
                duotone
              />
            </ClipReveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Eyebrow>Vision</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="vision-title" className="text-h3 mt-6 font-semibold text-white">
                {about.vision}
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="mt-12">
              <Eyebrow>Mission</Eyebrow>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-body text-ink-100 mt-6">{about.mission}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-12">
              <Eyebrow>Core values</Eyebrow>
            </Reveal>
            <StaggerGroup as="ul" className="border-border mt-6 border-t" stagger={0.06}>
              {about.coreValues.map((v, i) => (
                <StaggerItem
                  as="li"
                  key={v.title}
                  className="border-border flex items-start gap-4 border-b py-4"
                >
                  <span className="text-gold-400 font-label pt-1 text-[0.7rem] font-semibold tracking-[0.14em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="text-body block font-medium text-white">{v.title}</span>
                    <span className="text-ink-300 text-body mt-1 block">{v.text}</span>
                  </span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Section>

      <Section theme="light" aria-labelledby="areas-title">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow>Main business areas</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 id="areas-title" className="text-h2 mt-6 font-semibold">
                  {company.slogan}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12} className="lg:col-span-6 lg:col-start-7 lg:self-end">
              <p className="text-body text-muted-foreground">{about.businessAreasLead}</p>
            </Reveal>
          </div>
          <StaggerGroup
            as="ul"
            className="border-border mt-14 grid grid-cols-1 border-t md:grid-cols-2 lg:grid-cols-3"
            stagger={0.05}
            amount={0.1}
          >
            {about.businessAreas.map((a, i) => (
              <StaggerItem
                as="li"
                key={a.title}
                className="border-border flex flex-col gap-3 border-b py-8 md:pr-8"
              >
                <span className="text-muted-foreground font-label text-[0.7rem] font-semibold tracking-[0.14em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h4 font-semibold">{a.title}</h3>
                <p className="text-muted-foreground text-body">{a.text}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      <ExpertiseSection />
      <Commitment />
      <FinalCTA />
    </>
  );
}
