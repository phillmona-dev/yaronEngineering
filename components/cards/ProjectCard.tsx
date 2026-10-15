import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/lib/data/projects";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { Placeholder } from "@/components/ui/Placeholder";

export function ProjectCard({ project, reverse = false }: { project: Project; reverse?: boolean }) {
  return (
    <article className="border-border grid grid-cols-1 items-center gap-x-8 gap-y-8 border-t py-12 lg:grid-cols-12 lg:py-16">
      <div className={cn("lg:col-span-6", reverse && "lg:order-2")}>
        <ClipReveal className="aspect-[16/10] overflow-hidden rounded-md">
          <ParallaxImage
            src={project.image.src}
            alt={project.image.alt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            containerClassName="h-full w-full"
            strength={0.05}
            zoomOnHover
            className="saturate-[0.7]"
          />
        </ClipReveal>
      </div>
      <div
        className={cn("lg:col-span-5", reverse ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}
      >
        <p className="text-muted-foreground flex items-center gap-4 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          <span>Project {project.index}</span>
          <span aria-hidden className="bg-border-strong h-px w-6" />
          <span>{project.sector}</span>
        </p>
        <h3 className="text-h3 mt-5 font-semibold">{project.category}</h3>
        <p className="text-foreground mt-3 text-[0.9375rem] font-medium">{project.client}</p>
        <p className="text-body text-muted-foreground mt-4 max-w-[52ch]">{project.scope}</p>
        <dl className="border-border mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 text-sm">
          <div>
            <dt className="eyebrow mb-2">Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Result</dt>
            <dd>{project.result ?? <Placeholder label="Verified outcome" />}</dd>
          </div>
          <div className="col-span-2">
            <dt className="eyebrow mb-2">Technology</dt>
            <dd className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span key={t} className="bg-muted rounded-sm px-2 py-1 text-[0.8125rem]">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <Link
          href="/projects"
          className="group text-brand-text mt-7 inline-flex items-center gap-2 text-sm font-medium"
        >
          View project index
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
