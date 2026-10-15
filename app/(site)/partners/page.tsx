import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { WhyYaron } from "@/components/sections/WhyYaron";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Partners",
  description:
    "Yaron Engineering works with a growing network of global technology partners across networking, security, cloud, compute, storage and structured cabling.",
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Partners", path: "/partners" }])} />
      <PageHero
        eyebrow="Global partners"
        crumbs={[{ label: "Partners", href: "/partners" }]}
        title={[
          <span key="a">Partnerships that extend</span>,
          <span key="b">
            our <span className="text-brand-300">capability.</span>
          </span>,
        ]}
        lead="We design vendor-neutral and deliver with the global technology vendors whose platforms fit each requirement."
        image={{ src: "/images/photos/circuit.jpg", alt: "Macro view of a circuit board" }}
      />
      <PartnersSection grid />
      <WhyYaron />
      <FinalCTA />
    </>
  );
}
