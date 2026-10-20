import type { Metadata } from "next";
import { HomeHero } from "@/components/hero/HomeHero";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { SolutionsProcess } from "@/components/sections/SolutionsProcess";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { CustomersSection } from "@/components/sections/CustomersSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { WhyYaron } from "@/components/sections/WhyYaron";
import { Commitment } from "@/components/sections/Commitment";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { getSiteContent } from "@/lib/content/server";
import { pageMetadata } from "@/lib/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getSiteContent();
  return {
    ...pageMetadata({ description: home.meta.metaDescription, path: "/" }),
    title: { absolute: home.meta.metaTitle },
  };
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutIntro />
      <ServicesShowcase />
      <SolutionsProcess showPillars={false} />
      <IndustriesGrid />
      <ProjectsShowcase limit={4} />
      <CustomersSection limit={6} />
      <ExpertiseSection />
      <PartnersSection />
      <WhyYaron />
      <Commitment />
      <FinalCTA />
    </>
  );
}
