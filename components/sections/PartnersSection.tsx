import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PartnerMarquee } from "@/components/sections/PartnerMarquee";
import { PartnerSlot } from "@/components/cards/PartnerSlot";
import { getSiteContent } from "@/lib/content/server";
import { Highlight } from "@/lib/content/highlight";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Partners: an animated logo marquee on every placement, plus the full static grid on the
 * partners page (`grid`), where visitors expect to scan the complete list.
 */
export async function PartnersSection({ grid = false }: { grid?: boolean }) {
  const { partners: partnersContent, home } = await getSiteContent();
  const partners = partnersContent.items;
  const intro = home.sections.partners;
  return (
    <Section theme="light" aria-labelledby="partners-title" className="overflow-clip">
      <div className="container-x">
        <SectionHeader
          eyebrow={intro.eyebrow}
          title={
            <span id="partners-title">
              <Highlight text={intro.title} highlight={intro.highlight} />
            </span>
          }
          lead={intro.lead}
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
