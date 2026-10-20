import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { getSiteContent } from "@/lib/content/server";
import { Highlight } from "@/lib/content/highlight";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export async function ProjectsShowcase({ limit = 4 }: { limit?: number }) {
  const { projects, home } = await getSiteContent();
  const featuredProjects = projects.items.filter((p) => p.featured && p.image.src);
  const intro = home.sections.projects;
  return (
    <Section theme="light" aria-labelledby="projects-title">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow={intro.eyebrow}
            title={
              <span id="projects-title">
                <Highlight text={intro.title} highlight={intro.highlight} />
              </span>
            }
            lead={intro.lead}
          />
          <Reveal delay={0.2} className="shrink-0">
            <Button href="/projects" variant="secondary">
              {intro.ctaLabel}
            </Button>
          </Reveal>
        </div>
        <div className="border-border mt-12 border-b">
          {featuredProjects.slice(0, limit).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </Section>
  );
}
