import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <PageHero
        compact
        eyebrow="Legal"
        title={[<span key="a">{title}</span>]}
        lead={`Last updated ${updated}.`}
        crumbs={[{ label: title, href: "#" }]}
      />
      <Section theme="light">
        <div className="container-x">
          <div className="mx-auto flex max-w-[68ch] flex-col gap-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-h4 font-semibold">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-body text-muted-foreground mt-3">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
