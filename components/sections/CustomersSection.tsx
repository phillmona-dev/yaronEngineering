import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { TiltCard } from "@/components/animations/TiltCard";
import { customers } from "@/lib/data/customers";

export function CustomersSection({
  eyebrow = "National & Enterprise Partners",
  title = "Trusted by leading Ethiopian institutions.",
  lead = "Selected mission-critical programmes delivered across banking, public administration, national logistics and higher education.",
  className,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  className?: string;
}) {
  return (
    <Section theme="light" aria-labelledby="customers-section-title" className={className}>
      <div className="container-x">
        <SectionHeader
          eyebrow={eyebrow}
          title={
            <span id="customers-section-title">
              {title.split(".")[0]}.{" "}
              {title.includes(".") && (
                <span className="text-brand-text">{title.split(".").slice(1).join(".")}</span>
              )}
            </span>
          }
          lead={lead}
        />

        <StaggerGroup
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          stagger={0.06}
        >
          {customers.map((c) => (
            <StaggerItem key={c.id} y={16}>
              <TiltCard className="h-full rounded-xl">
                <div className="bg-surface group border-border hover:border-brand-500/40 flex h-full flex-col justify-between rounded-xl border p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8">
                  <div>
                    {/* Clean white backdrop for the official logo */}
                    <div className="border-border/60 mb-6 flex h-28 items-center justify-center rounded-lg border bg-white p-4 shadow-2xs">
                      <Image
                        src={c.logo}
                        alt={`${c.name} logo`}
                        width={160}
                        height={90}
                        className="max-h-20 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="text-foreground group-hover:text-brand-text text-center text-lg font-bold transition-colors">
                      {c.name}
                    </h3>

                    {c.amharicName && (
                      <p className="text-muted-foreground text-center text-xs font-normal">
                        {c.amharicName}
                      </p>
                    )}

                    <div className="mt-3 flex justify-center">
                      <span className="bg-brand-500/10 text-brand-text rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] tracking-wider uppercase">
                        {c.category}
                      </span>
                    </div>

                    <p className="text-muted-foreground mt-4 text-center text-sm leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="border-border/60 mt-6 border-t pt-4 text-center">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-text hover:text-brand-700 inline-flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors"
                    >
                      Official Portal
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
