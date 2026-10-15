import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { industries } from "@/lib/data/industries";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function IndustriesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <Section theme="dark" tone="soft" aria-labelledby="industries-title">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Industries"
            title={
              <span id="industries-title">
                Serving the institutions that <span className="text-brand-text">cannot pause.</span>
              </span>
            }
            lead="Government, finance, healthcare, education, NGOs and critical infrastructure — organizations where reliability and security are obligations, not features."
          />
          {!compact && (
            <Reveal delay={0.2} className="shrink-0">
              <Button href="/industries" variant="secondary">
                All industries
              </Button>
            </Reveal>
          )}
        </div>
        <StaggerGroup
          as="ul"
          className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          stagger={0.06}
          amount={0.1}
        >
          {industries.map((ind, i) => (
            <StaggerItem as="li" key={ind.slug}>
              <IndustryCard industry={ind} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
