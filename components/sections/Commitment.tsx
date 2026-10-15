import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { company } from "@/lib/data/company";

const outcomes = [
  {
    title: "Digitally transform",
    text: "Modern platforms and cloud foundations designed around how the organization actually operates.",
  },
  {
    title: "Scale securely",
    text: "Growth on an architecture where segmentation, identity and compliance were designed in from day one.",
  },
  {
    title: "Operate smarter",
    text: "Monitoring, documentation and support models that turn infrastructure into a managed capability.",
  },
];

export function Commitment() {
  return (
    <Section theme="light" tone="soft" aria-labelledby="commitment-title">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>Our commitment</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              inView
              delay={0.1}
              className="text-h1 mt-8 font-semibold"
              lines={[
                <span key="a">We don&apos;t just deploy systems.</span>,
                <span key="b">
                  We build the infrastructure{" "}
                  <span className="text-brand-text">organizations depend on.</span>
                </span>,
              ]}
            />
            <span id="commitment-title" className="sr-only">
              We don&apos;t just deploy systems. We build the infrastructure organizations depend
              on.
            </span>
          </div>
          <div className="text-body text-muted-foreground flex flex-col gap-5 lg:col-span-4 lg:pt-16">
            {company.commitment.map((p, i) => (
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
              <p className="text-muted-foreground font-mono text-[0.68rem] tracking-[0.14em]">
                0{i + 1}
              </p>
              <p className="text-h4 mt-4 font-semibold">{o.title}</p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{o.text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
