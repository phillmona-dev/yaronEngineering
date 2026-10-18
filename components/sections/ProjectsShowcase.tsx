import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { featuredProjects } from "@/lib/data/projects";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function ProjectsShowcase({ limit = 4 }: { limit?: number }) {
  return (
    <Section theme="light" aria-labelledby="projects-title">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Experience"
            title={
              <span id="projects-title">
                More than 30 high-impact projects.{" "}
                <span className="text-brand-text">Delivered.</span>
              </span>
            }
            lead="A selection of the programmes we have designed, implemented and supervised for the judiciary, banks, public institutions, universities, hospitality and enterprises."
          />
          <Reveal delay={0.2} className="shrink-0">
            <Button href="/projects" variant="secondary">
              All projects
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
