import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { CustomersSection } from "@/components/sections/CustomersSection";
import { WhyYaron } from "@/components/sections/WhyYaron";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Partners",
  description:
    "Yaron Engineering works with leading technology vendors and major Ethiopian enterprises across banking, government, logistics and higher education.",
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Partners", path: "/partners" }])} />
      <PageHero
        eyebrow="Global & domestic partners"
        crumbs={[{ label: "Partners", href: "/partners" }]}
        title={[
          <span key="a">Partnerships that extend</span>,
          <span key="b">
            our <span className="text-brand-300">capability.</span>
          </span>,
        ]}
        lead="We design vendor-neutral and deliver with global technology leaders and leading Ethiopian enterprise institutions."
        image={{ src: "/images/photos/circuit.jpg", alt: "Macro view of a circuit board" }}
      />
      <PartnersSection grid />
      <CustomersSection
        eyebrow="Domestic & Enterprise Partners"
        title="Enterprise partners & clients in Ethiopia."
        lead="Key infrastructure, cybersecurity, and systems delivered for premier banks, national enterprises, government bureaus and universities."
      />
      <WhyYaron />
      <FinalCTA />
    </>
  );
}
