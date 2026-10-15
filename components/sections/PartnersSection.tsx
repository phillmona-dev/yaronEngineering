import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PartnerMarquee } from "@/components/sections/PartnerMarquee";
import { PartnerSlot } from "@/components/cards/PartnerSlot";
import { partners } from "@/lib/data/partners";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Partners: an animated logo marquee on every placement, plus the full static grid on the
 * partners page (`grid`), where visitors expect to scan the complete list.
 */
export function PartnersSection({ grid = false }: { grid?: boolean }) {
  return (
    <Section theme="light" aria-labelledby="partners-title" className="overflow-hidden">
      <div className="container-x">
        <SectionHeader
          eyebrow="Global partners"
          title={
            <span id="partners-title">
              Technology partnerships that{" "}
              <span className="text-brand-text">extend our capability.</span>
            </span>
          }
          lead="A growing network of global technology vendors behind our designs — matched to each project by requirement, not by preference."
        />
      </div>

      <Reveal delay={0.1} className="border-border mt-14 border-y py-10 lg:mt-16 lg:py-12">
        <PartnerMarquee partners={partners} />
      </Reveal>

      {grid && (
        <div className="container-x">
          <StaggerGroup
            className="border-border mt-16 grid grid-cols-2 border-t border-l sm:grid-cols-3 lg:grid-cols-5"
            stagger={0.04}
            amount={0.15}
          >
            {partners.map((p) => (
              <StaggerItem key={p.name} y={12}>
                <PartnerSlot partner={p} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      )}
    </Section>
  );
}
