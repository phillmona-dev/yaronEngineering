import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { CustomersSection } from "@/components/sections/CustomersSection";
import { WhyYaron } from "@/components/sections/WhyYaron";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { getSiteContent } from "@/lib/content/server";
import { pageHeroProps } from "@/lib/content/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return pageMetadata({
    title: pages.partners.metaTitle,
    description: pages.partners.metaDescription,
    path: "/partners",
  });
}

export default async function PartnersPage() {
  const { pages } = await getSiteContent();
  const copy = pages.partners;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Partners", path: "/partners" }])} />
      <PageHero {...pageHeroProps(copy)} crumbs={[{ label: "Partners", href: "/partners" }]} />
      <PartnersSection grid />
      <CustomersSection
        eyebrow={copy.customersEyebrow}
        title={copy.customersTitle}
        lead={copy.customersLead}
      />
      <WhyYaron />
      <FinalCTA />
    </>
  );
}
