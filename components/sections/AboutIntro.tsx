import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { getSiteContent } from "@/lib/content/server";
import { Highlight } from "@/lib/content/highlight";

export async function AboutIntro() {
  const { home, about } = await getSiteContent();
  const intro = home.sections.about;
  const sectors = about.sectors;
  return (
    <Section theme="light" aria-labelledby="about-title">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          {/* Statement */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>{intro.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="about-title" className="text-h2 mt-6 font-semibold">
                <Highlight text={intro.title} highlight={intro.highlight} />
              </h2>
            </Reveal>
            <Reveal delay={0.16} className="mt-10 hidden lg:block">
              <ClipReveal className="aspect-[4/5] overflow-hidden rounded-md">
                <ParallaxImage
                  src="/images/photos/rack-mono.jpg"
                  alt="Server rack and structured cabling"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  containerClassName="h-full w-full"
                  strength={0.06}
                />
              </ClipReveal>
            </Reveal>
          </div>

          {/* Story */}
          <div className="lg:col-span-6 lg:col-start-7">
            <ClipReveal className="aspect-[16/10] overflow-hidden rounded-md">
              <ParallaxImage
                src="/images/photos/network-switch.jpg"
                alt="Enterprise network switch with patch cables"
                sizes="(min-width: 1024px) 50vw, 100vw"
                containerClassName="h-full w-full"
                strength={0.06}
              />
            </ClipReveal>

            <div className="text-body text-muted-foreground mt-10 flex flex-col gap-6">
              {about.story.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className={i === 0 ? "text-body text-foreground" : undefined}>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal
              delay={0.1}
              className="border-border mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4"
            >
              {sectors.map((s) => (
                <div key={s} className="flex flex-col gap-2">
                  <span aria-hidden className="bg-gold-500 h-px w-5" />
                  <span className="text-body font-medium">{s}</span>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <Button href="/about" variant="ghost">
                {intro.ctaLabel}
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
