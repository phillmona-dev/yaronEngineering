import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { projectGroups, projects } from "@/lib/data/projects";

/** Full project reference list, grouped by service line as in the company profile. */
export function ProjectIndex() {
  return (
    <Section theme="light" aria-labelledby="project-index-title">
      <div className="container-x">
        <Reveal>
          <Eyebrow>Project index</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="project-index-title" className="text-h2 mt-6 max-w-[24ch] font-semibold">
            Customers and project <span className="text-brand-text">experience.</span>
          </h2>
        </Reveal>

        {projectGroups.map((group) => {
          const items = projects.filter((p) => p.group === group.id);
          return (
            <div key={group.id} className="mt-16 lg:mt-20">
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-12">
                <Reveal className="lg:col-span-6">
                  <h3 className="text-h3 font-semibold">{group.title}</h3>
                </Reveal>
                <Reveal delay={0.06} className="lg:col-span-5 lg:col-start-8 lg:self-end">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {group.description}
                  </p>
                </Reveal>
              </div>

              <StaggerGroup
                as="ul"
                className="border-border-strong mt-8 border-t"
                stagger={0.03}
                amount={0.05}
              >
                {items.map((p) => (
                  <StaggerItem
                    as="li"
                    key={p.id}
                    y={10}
                    className="border-border grid grid-cols-1 gap-x-8 gap-y-3 border-b py-6 md:grid-cols-12"
                  >
                    <div className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.12em] uppercase md:col-span-2">
                      {p.year ?? "—"}
                    </div>
                    <div className="flex items-start gap-4 md:col-span-4">
                      {p.clientLogo && (
                        <div className="border-border flex h-11 w-14 shrink-0 items-center justify-center rounded-md border bg-white p-1.5">
                          <Image
                            src={p.clientLogo}
                            alt={`${p.client} logo`}
                            width={56}
                            height={44}
                            className="max-h-8 w-auto max-w-full object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-[0.9375rem] font-semibold">{p.name}</p>
                        <p className="text-muted-foreground mt-1 text-sm">{p.client}</p>
                        <p className="text-muted-foreground mt-2 font-mono text-[0.62rem] tracking-[0.12em] uppercase">
                          {p.sector} · {p.location}
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.summary}</p>
                      {p.highlights.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {p.highlights.map((h) => (
                            <li key={h} className="bg-muted rounded-sm px-2 py-1 text-[0.8125rem]">
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
