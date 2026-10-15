import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Reveal } from "@/components/animations/Reveal";
import { Credibility } from "@/components/sections/Credibility";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { projects, projectCategories } from "@/lib/data/projects";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Selected ICT infrastructure, data center, cybersecurity and cloud projects delivered by Yaron Engineering for banks, public institutions, universities and enterprises in Ethiopia.",
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
            for institutions that <span className="text-brand-300">matter.</span>
          </span>,
        ]}
        lead="More than 30 high-impact projects for more than 40 clients across government, finance, education and enterprise. A selection is indexed below; detailed case studies are published as they are approved."
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

      <Section theme="light" className="pt-10 md:pt-14 xl:pt-16" aria-label="Project index">
        <div className="container-x border-border border-b">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} reverse={i % 2 === 1} />
          ))}
        </div>
        <div className="container-x mt-8">
          <p className="text-muted-foreground font-mono text-[0.68rem] tracking-[0.12em] uppercase">
            Outcomes and metrics are shown only once verified with the client. Additional projects
            are added to the index on approval.
          </p>
        </div>
      </Section>
      <FinalCTA />
    </>
  );
}
