import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { getSiteContent } from "@/lib/content/server";
import { GlobeCanvas } from "@/components/sections/GlobeCanvas";

export async function FinalCTA(props: {
  title?: [string, string];
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  const { home, company } = await getSiteContent();
  const cta = home.finalCta;
  const title = props.title ?? [cta.titleLine1, cta.titleLine2];
  const text = props.text ?? cta.text;
  const primary = props.primary ?? cta.primary;
  const secondary = props.secondary ?? cta.secondary;
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
          className="duotone-media object-cover object-center"
        />
        {/* Blue duotone so the night-earth photo reads as brand blue, not black */}
        <div aria-hidden className="duotone-shadows absolute inset-0" />
        <div aria-hidden className="duotone-lights absolute inset-0" />
        <div
          aria-hidden
          className="from-ink-950/70 via-ink-950/10 to-ink-950/70 absolute inset-0 bg-gradient-to-b"
        />
        {/* left text-protection gradient */}
        <div
          aria-hidden
          className="from-ink-950/85 via-ink-950/25 absolute inset-0 bg-gradient-to-r to-transparent"
          style={{ backgroundSize: "60% 100%" }}
        />
      </div>

      {/* ── Animated globe (right side) ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <GlobeCanvas />
      </div>

      {/* ── Content ── */}
      <div className="container-x relative flex flex-col justify-center py-24 lg:py-32">
        <Reveal>
          <p className="eyebrow text-ink-300">
            {company.headquarters.city} · {company.headquarters.country}
          </p>
        </Reveal>
        <TextReveal
          as="h2"
          inView
          delay={0.1}
          className="text-h1 mt-8 max-w-[14ch] font-bold text-white"
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
