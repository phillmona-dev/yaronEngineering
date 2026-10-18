import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Reveal } from "@/components/animations/Reveal";
import { Credibility } from "@/components/sections/Credibility";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { featuredProjects, projectCategories } from "@/lib/data/projects";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "ICT infrastructure, data center, cybersecurity, surveillance and cloud projects delivered by Yaron Engineering for the judiciary, banks, public institutions, universities, NGOs and enterprises in Ethiopia.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Projects", path: "/projects" }])} />
      <PageHero
        eyebrow="Projects & experience"
        crumbs={[{ label: "Projects", href: "/projects" }]}
        title={[
          <span key="a">Infrastructure delivered</span>,
          <span key="b">
            for institutions that <span className="text-gold-400">matter.</span>
          </span>,
        ]}
        lead="More than 30 high-impact projects for more than 40 clients across government institutions, enterprises, NGOs and financial organizations — consultancy, system integration, supply and cloud services."
        image={{
          src: "/images/photos/network-switch.jpg",
          alt: "Enterprise network switch with patch cables",
        }}
      >
        <Reveal delay={0.55} className="mt-10 flex flex-wrap gap-2">
          {projectCategories.map((c) => (
            <span
              key={c}
              className="text-ink-200 rounded-sm border border-white/15 px-3 py-1.5 font-mono text-[0.66rem] tracking-[0.12em] uppercase"
            >
              {c}
            </span>
          ))}
        </Reveal>
      </PageHero>

      <Credibility />

      <Section theme="light" className="pt-10 md:pt-14 xl:pt-16" aria-label="Featured projects">
        <div className="container-x border-border border-b">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </Section>
      <ProjectIndex />
      <FinalCTA />
    </>
  );
}
