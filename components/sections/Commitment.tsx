import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { getSiteContent } from "@/lib/content/server";
import { Highlight } from "@/lib/content/highlight";

export async function Commitment() {
  const { home, about } = await getSiteContent();
  const copy = home.sections.commitment;
  const outcomes = copy.outcomes;
  return (
    <Section theme="light" tone="soft" aria-labelledby="commitment-title">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>{copy.eyebrow}</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              inView
              delay={0.1}
              className="text-h2 mt-8 font-semibold"
              lines={[
                <span key="a">{copy.titleLine1}</span>,
                <span key="b">
                  <Highlight text={copy.titleLine2} highlight={copy.highlight} />
                </span>,
              ]}
            />
            <span id="commitment-title" className="sr-only">
              {copy.titleLine1} {copy.titleLine2}
            </span>
          </div>
          <div className="text-body text-muted-foreground flex flex-col gap-5 lg:col-span-4 lg:pt-16">
            {about.commitment.map((p, i) => (
              <Reveal key={i} delay={0.1 + 0.06 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <StaggerGroup
          as="ul"
          className="border-border-strong bg-border-strong mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-md border md:grid-cols-3"
          stagger={0.08}
        >
          {outcomes.map((o, i) => (
            <StaggerItem as="li" key={o.title} className="bg-surface p-7 lg:p-9">
              <p className="text-muted-foreground font-label text-[0.7rem] font-semibold tracking-[0.14em]">
                0{i + 1}
              </p>
              <p className="text-h4 mt-4 font-semibold">{o.title}</p>
              <p className="text-muted-foreground text-body mt-3">{o.text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
