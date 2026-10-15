import { HomeHero } from "@/components/hero/HomeHero";
import { Credibility } from "@/components/sections/Credibility";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { SolutionsProcess } from "@/components/sections/SolutionsProcess";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { WhyYaron } from "@/components/sections/WhyYaron";
import { Commitment } from "@/components/sections/Commitment";
import { FinalCTA } from "@/components/sections/FinalCTA";

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
      <ExpertiseSection />
      <PartnersSection />
      <WhyYaron />
      <Commitment />
      <FinalCTA />
    </>
  );
}
