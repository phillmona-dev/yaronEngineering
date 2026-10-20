import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { getSiteContent } from "@/lib/content/server";
import { pageHeroProps } from "@/lib/content/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return pageMetadata({
    title: pages.careers.metaTitle,
    description: pages.careers.metaDescription,
    path: "/careers",
  });
}

export default async function CareersPage() {
  const { careers, company, pages } = await getSiteContent();
  const careerValues = careers.values;
  const openRoles = careers.openRoles;
  const copy = pages.careers;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Careers", path: "/careers" }])} />
      <PageHero {...pageHeroProps(copy)} crumbs={[{ label: "Careers", href: "/careers" }]} />

      <Section theme="light" aria-labelledby="careers-why">
        <div className="container-x grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ClipReveal className="aspect-[4/5] overflow-hidden rounded-md">
              <ParallaxImage
                src="/images/photos/cloud-waves.jpg"
                alt="Abstract flowing blue surfaces"
                sizes="(min-width: 1024px) 40vw, 100vw"
                containerClassName="h-full w-full"
                strength={0.06}
              />
            </ClipReveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>{copy.whyEyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="careers-why" className="text-h2 mt-6 font-semibold">
                {copy.whyHeading}
              </h2>
            </Reveal>
            <StaggerGroup as="ul" className="border-border-strong mt-10 border-t" stagger={0.08}>
              {careerValues.map((v, i) => (
                <StaggerItem
                  as="li"
                  key={v.title}
                  className="border-border grid grid-cols-[3rem_1fr] gap-4 border-b py-6"
                >
                  <span className="text-muted-foreground font-label pt-1 text-[0.7rem] font-semibold tracking-[0.14em]">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-h4 font-semibold">{v.title}</h3>
                    <p className="text-body text-muted-foreground mt-2">{v.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Section>

      <Section theme="dark" aria-labelledby="roles-title">
        <div className="container-x">
          <Reveal>
            <Eyebrow>{copy.rolesEyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="roles-title" className="text-h2 mt-6 font-semibold text-white">
              {copy.rolesHeading}
            </h2>
          </Reveal>
          {openRoles.length === 0 ? (
            <Reveal
              delay={0.16}
              className="border-border-strong mt-10 max-w-[60ch] rounded-md border border-dashed p-8"
            >
              <p className="text-body text-ink-200">{copy.noVacanciesText}</p>
              <div className="mt-6">
                <Button
                  href={`mailto:${company.contact.email}?subject=Speculative application`}
                  variant="secondary"
                  arrow="up"
                >
                  {copy.applyLabel}
                </Button>
              </div>
            </Reveal>
          ) : (
            <ul className="border-border mt-10 border-t">
              {openRoles.map((r) => (
                <li
                  key={r.title}
                  className="border-border flex flex-col gap-2 border-b py-6 md:flex-row md:items-center md:justify-between"
                >
                  <span className="text-h4 font-semibold text-white">{r.title}</span>
                  <span className="text-ink-300 font-label text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
                    {r.team} · {r.location} · {r.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
      <FinalCTA
        title={[copy.finalCta.titleLine1, copy.finalCta.titleLine2]}
        text={copy.finalCta.text}
        primary={copy.finalCta.primary}
        secondary={copy.finalCta.secondary}
      />
    </>
  );
}
