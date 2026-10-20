import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SolutionsProcess } from "@/components/sections/SolutionsProcess";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { serviceIcon } from "@/lib/content/icons";
import { Highlight } from "@/lib/content/highlight";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { getSiteContent } from "@/lib/content/server";
import { pageHeroProps } from "@/lib/content/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return pageMetadata({
    title: pages.services.metaTitle,
    description: pages.services.metaDescription,
    path: "/services",
  });
}

export default async function ServicesPage() {
  const { services: servicesContent, about, pages } = await getSiteContent();
  const services = servicesContent.items;
  const copy = pages.services;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <PageHero {...pageHeroProps(copy)} crumbs={[{ label: "Services", href: "/services" }]} />

      <Section theme="dark" aria-label="Service index">
        <div className="container-x">
          <StaggerGroup
            as="ul"
            className="border-border bg-border grid grid-cols-1 gap-px overflow-hidden rounded-md border md:grid-cols-2"
            stagger={0.06}
            amount={0.05}
          >
            {services.map((s) => {
              const Icon = serviceIcon(s.icon);
              return (
                <StaggerItem as="li" key={s.slug} className="bg-ink-950">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group hover:bg-ink-900 focus-visible:bg-ink-900 relative flex h-full flex-col overflow-hidden transition-colors duration-300 outline-none"
                  >
                    <div className="relative aspect-[16/8] overflow-hidden">
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="ease-out-expo duotone-media object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div aria-hidden className="duotone-shadows absolute inset-0" />
                      <div aria-hidden className="duotone-lights absolute inset-0" />
                      <div aria-hidden className="image-overlay absolute inset-0" />
                      <span className="text-ink-200 font-label absolute top-6 left-6 text-[0.7rem] font-semibold tracking-[0.14em]">
                        {s.index}
                      </span>
                      <Icon
                        className="text-gold-400 absolute top-6 right-6 size-5"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      <h2 className="text-h3 font-semibold text-white">{s.title}</h2>
                      <p className="text-body text-ink-300 mt-3 max-w-[52ch]">{s.summary}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {s.capabilities.map((c) => (
                          <li
                            key={c}
                            className="border-border text-ink-300 font-label rounded-sm border px-2 py-1 text-[0.7rem] font-semibold tracking-[0.14em] uppercase"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                      <span className="text-gold-400 text-body mt-auto inline-flex items-center gap-2 pt-8 font-medium transition-colors group-hover:text-white">
                        Explore {s.shortTitle}
                        <ArrowUpRight
                          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="bg-brand-400 ease-out-expo absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    />
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </Section>

      <Section theme="light" aria-labelledby="delivery-title">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <Eyebrow>{copy.deliveryEyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 id="delivery-title" className="text-h2 mt-6 font-semibold">
                  <Highlight text={copy.deliveryTitle} highlight={copy.deliveryHighlight} />
                </h2>
              </Reveal>
            </div>
          </div>
          <StaggerGroup
            as="ul"
            className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3"
            stagger={0.08}
            amount={0.1}
          >
            {about.serviceLines.map((line, i) => (
              <StaggerItem
                as="li"
                key={line.title}
                className="border-border bg-surface flex flex-col rounded-md border p-6 lg:p-8"
              >
                <span className="text-muted-foreground font-label text-[0.7rem] font-semibold tracking-[0.14em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h4 mt-4 font-semibold">{line.title}</h3>
                <p className="text-muted-foreground text-body mt-3">{line.text}</p>
                <ul className="border-border mt-6 border-t">
                  {line.items.map((item) => (
                    <li
                      key={item}
                      className="border-border text-body flex items-start gap-3 border-b py-3"
                    >
                      <span aria-hidden className="bg-brand mt-2 size-1.5 shrink-0 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      <SolutionsProcess showPillars={false} />
      <FinalCTA />
    </>
  );
}
