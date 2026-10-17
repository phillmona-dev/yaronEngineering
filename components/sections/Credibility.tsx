import { Counter } from "@/components/animations/Counter";
import { StaggerGroup, StaggerItem } from "@/components/animations/Stagger";
import { stats } from "@/lib/data/company";

/** Large-typography credibility strip directly after the hero. */
export function Credibility() {
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
              <p className="text-stat text-gold-400 font-medium">
                <Counter value={s.value} suffix={s.suffix} plain={"plain" in s && s.plain} />
              </p>
              <div>
                <p className="text-ink-100 text-[0.9375rem] font-medium">{s.label}</p>
                <p className="text-ink-400 mt-1 font-mono text-[0.68rem] tracking-[0.12em] uppercase">
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
