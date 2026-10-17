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
import { careerValues, openRoles } from "@/lib/data/careers";
import { company } from "@/lib/data/company";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Join Yaron Engineering PLC in Addis Ababa and build the ICT infrastructure and cybersecurity systems Ethiopia and East Africa depend on.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Careers", path: "/careers" }])} />
      <PageHero
        eyebrow="Careers"
        crumbs={[{ label: "Careers", href: "/careers" }]}
        title={[
          <span key="a">Engineer the systems</span>,
          <span key="b">
            a region <span className="text-gold-400">depends on.</span>
          </span>,
        ]}
        lead="We hire engineers, consultants and project leaders who want their work to run banks, ministries and universities."
        image={{ src: "/images/photos/boardroom.jpg", alt: "Modern boardroom with glass walls" }}
      />

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
              <Eyebrow>Why join</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="careers-why" className="text-h2 mt-6 font-semibold">
                Serious work, senior mentorship, real impact.
              </h2>
            </Reveal>
            <StaggerGroup as="ul" className="border-border-strong mt-10 border-t" stagger={0.08}>
              {careerValues.map((v, i) => (
                <StaggerItem
                  as="li"
                  key={v.title}
                  className="border-border grid grid-cols-[3rem_1fr] gap-4 border-b py-6"
                >
                  <span className="text-muted-foreground pt-1 font-mono text-[0.7rem] tracking-[0.14em]">
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
            <Eyebrow>Open roles</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="roles-title" className="text-h2 mt-6 font-semibold text-white">
              Current opportunities
            </h2>
          </Reveal>
          {openRoles.length === 0 ? (
            <Reveal
              delay={0.16}
              className="border-border-strong mt-10 max-w-[60ch] rounded-md border border-dashed p-8"
            >
              <p className="text-body text-ink-200">
                No vacancies are published at the moment. We review speculative applications from
                experienced network, data center, security and cloud engineers on a rolling basis.
              </p>
              <div className="mt-6">
                <Button
                  href={`mailto:${company.contact.email}?subject=Speculative application`}
                  variant="secondary"
                  arrow="up"
                >
                  Send a speculative application
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
                  <span className="text-ink-300 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
                    {r.team} · {r.location} · {r.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
      <FinalCTA
        title={["Build what", "comes next."]}
        text="Tell us about your experience and the problems you want to work on."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "About Yaron", href: "/about" }}
      />
    </>
  );
}
