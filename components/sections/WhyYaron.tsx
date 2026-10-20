import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { Glow } from "@/components/ui/Backdrop";
import { getSiteContent } from "@/lib/content/server";
import { Highlight } from "@/lib/content/highlight";

export async function WhyYaron() {
  const { why, home } = await getSiteContent();
  const whyPrinciples = why.principles;
  const intro = home.sections.why;
  return (
    <Section theme="light" tone="soft" className="overflow-clip" aria-labelledby="why-title">
      <Glow
        className="bottom-0 -left-48 h-[560px] w-[560px] opacity-30"
        color="rgba(166,204,247,0.5)"
      />
      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeader
                eyebrow={intro.eyebrow}
                title={
                  <span id="why-title">
                    <Highlight text={intro.title} highlight={intro.highlight} />
                  </span>
                }
                lead={intro.lead}
              />
            </div>
          </div>
          <ol className="border-border border-t lg:col-span-8">
            {whyPrinciples.map((p, i) => (
              <Reveal as="li" key={p.index} delay={0.03 * i} amount={0.3}>
                <div className="group border-border grid grid-cols-[3rem_1fr] gap-6 border-b py-8 transition-colors duration-300 md:grid-cols-[6rem_1fr] md:py-10">
                  <span className="text-muted-foreground group-hover:text-brand-text font-label pt-2 text-[0.7rem] font-semibold tracking-[0.14em] transition-colors">
                    {p.index}
                  </span>
                  <div className="grid gap-4 md:grid-cols-12">
                    <h3 className="text-h4 font-semibold md:col-span-5">{p.title}</h3>
                    <p className="text-body text-muted-foreground md:col-span-7">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
