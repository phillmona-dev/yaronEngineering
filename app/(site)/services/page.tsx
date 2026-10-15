import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { SolutionsProcess } from "@/components/sections/SolutionsProcess";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { services } from "@/lib/data/services";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "ICT infrastructure, data center design, ICT consultancy, cybersecurity, cloud, enterprise servers and storage, and physical security systems — delivered end to end by Yaron Engineering.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <PageHero
        eyebrow="Services"
        crumbs={[{ label: "Services", href: "/services" }]}
        title={[
          <span key="a">From the physical layer</span>,
          <span key="b">
            to the <span className="text-brand-300">security</span> operations center.
          </span>,
        ]}
        lead="Seven core competencies, delivered as consulting, system integration, training and supply — by one accountable engineering team."
        image={{
          src: "/images/photos/network-red.jpg",
          alt: "Dense structured cabling in a network rack",
        }}
      />

      <Section theme="dark" aria-label="Service index">
        <div className="container-x">
          <StaggerGroup
            as="ul"
            className="border-border bg-border grid grid-cols-1 gap-px overflow-hidden rounded-md border md:grid-cols-2"
            stagger={0.06}
            amount={0.05}
          >
            {services.map((s) => (
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
                      className="ease-out-expo object-cover saturate-[0.7] transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div aria-hidden className="image-overlay absolute inset-0" />
                    <span className="text-ink-200 absolute top-6 left-6 font-mono text-[0.7rem] tracking-[0.14em]">
                      {s.index}
                    </span>
                    <s.icon
                      className="text-brand-300 absolute top-6 right-6 size-5"
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
                          className="border-border text-ink-300 rounded-sm border px-2 py-1 font-mono text-[0.66rem] tracking-[0.1em] uppercase"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                    <span className="text-brand-300 mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium transition-colors group-hover:text-white">
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
            ))}
          </StaggerGroup>
        </div>
      </Section>

      <SolutionsProcess showPillars={false} />
      <FinalCTA />
    </>
  );
}
