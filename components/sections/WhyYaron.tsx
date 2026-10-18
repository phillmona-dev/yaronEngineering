import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { Glow } from "@/components/ui/Backdrop";
import { whyPrinciples } from "@/lib/data/why";

export function WhyYaron() {
  return (
    <Section theme="dark" className="overflow-clip" aria-labelledby="why-title">
      <Glow className="bottom-0 -left-48 h-[560px] w-[560px] opacity-40" />
      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeader
                eyebrow="Why Yaron"
                title={
                  <span id="why-title">
                    Why organizations <span className="text-brand-text">choose Yaron.</span>
                  </span>
                }
                lead="Six principles that shape how we design, deliver and stand behind critical infrastructure."
              />
            </div>
          </div>
          <ol className="border-border border-t lg:col-span-8">
            {whyPrinciples.map((p, i) => (
              <Reveal as="li" key={p.index} delay={0.03 * i} amount={0.3}>
                <div className="group border-border grid grid-cols-[3rem_1fr] gap-6 border-b py-8 transition-colors duration-300 md:grid-cols-[6rem_1fr] md:py-10">
                  <span className="text-ink-400 group-hover:text-gold-400 pt-2 font-mono text-[0.72rem] tracking-[0.14em] transition-colors">
                    {p.index}
                  </span>
                  <div className="grid gap-4 md:grid-cols-12">
                    <h3 className="text-h3 font-semibold text-white md:col-span-5">{p.title}</h3>
                    <p className="text-body text-ink-300 md:col-span-7">{p.text}</p>
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
