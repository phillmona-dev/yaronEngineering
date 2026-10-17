import { HomeHero } from "@/components/hero/HomeHero";
import { Credibility } from "@/components/sections/Credibility";
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
import { AdminLinkButton } from "@/components/ui/AdminLinkButton";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Credibility />
      <AboutIntro />
      <ServicesShowcase />
      <SolutionsProcess showPillars={false} />
      <IndustriesGrid />
      <ProjectsShowcase limit={4} />
      <CustomersSection
        eyebrow="National & Enterprise Partners"
        title="Institutions that trust Yaron Engineering."
        lead="Mission-critical data center, cybersecurity, and cloud programmes delivered across Ethiopia."
      />
      <ExpertiseSection />
      <PartnersSection />
      <WhyYaron />
      <Commitment />
      <FinalCTA />
      <AdminLinkButton />
    </>
  );
}
