import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { SolutionsProcess } from "@/components/sections/SolutionsProcess";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { getSiteContent } from "@/lib/content/server";
import { pageHeroProps } from "@/lib/content/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return pageMetadata({
    title: pages.solutions.metaTitle,
    description: pages.solutions.metaDescription,
    path: "/solutions",
  });
}

export default async function SolutionsPage() {
  const { pages } = await getSiteContent();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Solutions", path: "/solutions" }])} />
      <PageHero
        {...pageHeroProps(pages.solutions)}
        crumbs={[{ label: "Solutions", href: "/solutions" }]}
      />
      <SolutionsProcess showCta={false} />
      <ServicesShowcase />
      <FinalCTA />
    </>
  );
}
