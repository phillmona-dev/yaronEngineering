import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
  limit,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  className?: string;
  /** Show only the first N clients with an official logo and website (used on the home page). */
  limit?: number;
}) {
  const list = limit ? customers.filter((c) => c.logo && c.url).slice(0, limit) : customers;
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
          {list.map((c) => {
            const external = Boolean(c.url);
            const cardClass =
              "client-card bg-surface group border-border hover:border-transparent focus-visible:border-transparent flex h-full flex-col justify-between rounded-xl border p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-2 hover:shadow-xl focus-visible:-translate-y-2 focus-visible:outline-none sm:p-8";
            const body = (
              <>
                <div>
                  {/* Clean white backdrop for the official logo */}
                  <div className="client-logo border-border/60 mb-6 flex h-28 items-center justify-center rounded-lg border bg-white p-4 shadow-2xs">
                    {c.logo ? (
                      <Image
                        src={c.logo}
                        alt={`${c.name} logo`}
                        width={160}
                        height={90}
                        className="max-h-20 w-auto max-w-[150px] object-contain"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="text-ink-400 group-hover:text-brand-text text-center text-2xl font-semibold tracking-[-0.02em] transition-colors duration-300"
                      >
                        {c.shortName ?? c.name}
                      </span>
                    )}
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
                    <span className="bg-brand-500/10 text-brand-text group-hover:bg-gold-500/20 rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] tracking-wider uppercase transition-colors duration-300">
                      {c.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-4 text-center text-sm leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="border-border/60 mt-6 border-t pt-4 text-center">
                  <span className="text-brand-text group-hover:text-brand-700 inline-flex items-center gap-1 text-xs font-semibold tracking-wide transition-colors">
                    {external ? "Visit official website" : "View our projects"}
                    {external ? (
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    ) : (
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </span>
                </div>
              </>
            );
            return (
              <StaggerItem key={c.id} y={28}>
                <TiltCard className="h-full rounded-xl">
                  {external ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${c.name} — visit official website (opens in a new tab)`}
                      className={cardClass}
                    >
                      {body}
                    </a>
                  ) : (
                    <Link
                      href="/projects"
                      aria-label={`${c.name} — view our projects`}
                      className={cardClass}
                    >
                      {body}
                    </Link>
                  )}
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </Section>
  );
}
