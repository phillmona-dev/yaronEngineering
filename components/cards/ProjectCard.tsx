import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ProjectContent } from "@/lib/content/types";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { ClipReveal } from "@/components/animations/ClipReveal";

export function ProjectCard({
  project,
  index,
  reverse = false,
}: {
  project: ProjectContent;
  index: number;
  reverse?: boolean;
}) {
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
        <p className="text-muted-foreground font-label flex items-center gap-4 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
          <span>Project {String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden className="bg-border-strong h-px w-6" />
          <span>{project.sector}</span>
        </p>
        <div className="mt-5 flex items-start justify-between gap-4">
          <h3 className="text-h3 font-semibold">{project.name}</h3>
          {project.clientLogo && (
            <div className="bg-surface border-border flex h-12 w-20 shrink-0 items-center justify-center rounded-md border p-1.5 shadow-xs">
              <Image
                src={project.clientLogo}
                alt={`${project.client} logo`}
                width={80}
                height={48}
                className="max-h-9 w-auto max-w-full object-contain"
              />
            </div>
          )}
        </div>
        <p className="text-foreground text-body mt-3 font-medium">{project.client}</p>
        <p className="text-body text-muted-foreground mt-4 max-w-[52ch]">{project.summary}</p>
        {project.highlights.length > 0 && (
          <ul className="mt-5 flex flex-col gap-1.5">
            {project.highlights.map((h) => (
              <li key={h} className="text-body flex items-center gap-3">
                <span aria-hidden className="bg-brand size-1.5 shrink-0 rounded-full" />
                {h}
              </li>
            ))}
          </ul>
        )}
        <dl className="border-border text-body mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6">
          <div>
            <dt className="eyebrow mb-2">Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">Period</dt>
            <dd>{project.year || "—"}</dd>
          </div>
          <div className="col-span-2">
            <dt className="eyebrow mb-2">Technology</dt>
            <dd className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span key={t} className="bg-muted text-body rounded-sm px-2 py-1">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <Link
          href="/projects"
          className="group text-brand-text text-body mt-7 inline-flex items-center gap-2 font-medium"
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
