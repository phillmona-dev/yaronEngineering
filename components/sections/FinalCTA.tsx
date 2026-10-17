import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { company } from "@/lib/data/company";
import { GlobeCanvas } from "@/components/sections/GlobeCanvas";

export function FinalCTA({
  title = ["Let's engineer", "what's next."],
  text = "Tell us what you're building, protecting or transforming. Our team can help architect the infrastructure behind it.",
  primary = { label: "Start a Conversation", href: "/contact" },
  secondary = { label: "Explore Our Services", href: "/services" },
}: {
  title?: [string, string];
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section
      data-theme="dark"
      className="bg-ink-950 text-foreground relative isolate overflow-hidden"
      aria-labelledby="cta-title"
    >
      {/* ── Background: earth-night image — lighter overlays ── */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/photos/earth-night.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        {/* lighter top+bottom vignette */}
        <div
          aria-hidden
          className="from-ink-950/80 via-ink-950/20 to-ink-950/80 absolute inset-0 bg-gradient-to-b"
        />
        {/* left text-protection gradient */}
        <div
          aria-hidden
          className="from-ink-950/85 absolute inset-0 bg-gradient-to-r to-transparent via-ink-950/20"
          style={{ backgroundSize: "60% 100%" }}
        />
      </div>

      {/* ── Animated globe (right side) ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <GlobeCanvas />
      </div>

      {/* ── Content ── */}
      <div className="container-x relative flex min-h-[80svh] flex-col justify-center py-28 lg:py-40">
        <Reveal>
          <p className="eyebrow text-ink-300">
            {company.headquarters.city} · {company.headquarters.country}
          </p>
        </Reveal>
        <TextReveal
          as="h2"
          inView
          delay={0.1}
          className="text-display mt-8 max-w-[14ch] font-semibold text-white"
          lines={[
            <span key="a">{title[0]}</span>,
            <span key="b" className="text-gold-400">
              {title[1]}
            </span>,
          ]}
        />
        <span id="cta-title" className="sr-only">
          {title.join(" ")}
        </span>
        <Reveal delay={0.3}>
          <p className="text-lead text-ink-200 mt-8 max-w-[48ch]">{text}</p>
        </Reveal>
        <Reveal delay={0.4} className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <MagneticButton>
            <Button href={primary.href} size="lg">
              {primary.label}
            </Button>
          </MagneticButton>
          <Button href={secondary.href} size="lg" variant="secondary" arrow={false}>
            {secondary.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
