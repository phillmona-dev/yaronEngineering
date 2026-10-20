import { Counter } from "@/components/animations/Counter";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { getSiteContent } from "@/lib/content/server";

/** Large-typography credibility strip directly after the hero. */
export async function Credibility() {
  const { home } = await getSiteContent();
  const stats = home.stats;
  return (
    <section
      data-theme="dark"
      className="bg-ink-950 text-foreground relative"
      aria-label="Company at a glance"
    >
      <div className="container-x">
        <StaggerGroup
          as="ul"
          className="border-border grid grid-cols-2 border-t lg:grid-cols-4"
          stagger={0.1}
        >
          {stats.map((s, i) => (
            <StaggerItem
              as="li"
              key={s.label}
              className={[
                "flex flex-col gap-4 pt-12 pb-24 lg:pt-16 lg:pb-32",
                i % 2 === 1 ? "border-border border-l pl-6 lg:pl-10" : "",
                i >= 2 ? "border-border border-t lg:border-t-0" : "",
                i === 2 ? "lg:border-l lg:pl-10" : "",
              ].join(" ")}
            >
              <p className="text-stat text-gold-400 font-display font-bold">
                <Counter value={s.value} suffix={s.suffix} plain={s.plain} />
              </p>
              <div>
                <p className="text-ink-100 text-body font-medium">{s.label}</p>
                <p className="text-ink-400 font-label mt-1 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
                  {s.note}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
