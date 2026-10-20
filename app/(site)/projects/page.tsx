import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Reveal } from "@/components/animations/Reveal";
import { Credibility } from "@/components/sections/Credibility";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { getSiteContent } from "@/lib/content/server";
import { pageHeroProps } from "@/lib/content/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return pageMetadata({
    title: pages.projects.metaTitle,
    description: pages.projects.metaDescription,
    path: "/projects",
  });
}

export default async function ProjectsPage() {
  const { projects, pages } = await getSiteContent();
  const featuredProjects = projects.items.filter((p) => p.featured && p.image.src);
  const projectCategories = pages.projects.categories;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Projects", path: "/projects" }])} />
      <PageHero
        {...pageHeroProps(pages.projects)}
        crumbs={[{ label: "Projects", href: "/projects" }]}
      >
        <Reveal delay={0.55} className="mt-10 flex flex-wrap gap-2">
          {projectCategories.map((c) => (
            <span
              key={c}
              className="text-ink-200 font-label rounded-sm border border-white/15 px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] uppercase"
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
