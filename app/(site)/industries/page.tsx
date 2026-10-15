import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/animations/Reveal";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { industries } from "@/lib/data/industries";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = pageMetadata({
  title: "Industries",
  description:
    "Yaron Engineering serves government, banking and financial services, insurance, healthcare, NGOs, enterprise, education and critical infrastructure across Ethiopia and East Africa.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Industries", path: "/industries" }])} />
      <PageHero
        eyebrow="Industries"
        crumbs={[{ label: "Industries", href: "/industries" }]}
        title={[
          <span key="a">Serving the institutions</span>,
          <span key="b">
            that <span className="text-brand-300">cannot pause.</span>
          </span>,
        ]}
        lead="Eight sectors where reliability, security and compliance are obligations — and where Yaron Engineering has the depth to deliver."
        image={{ src: "/images/photos/financial-district.jpg", alt: "Financial district towers" }}
      />

      <Section theme="light" aria-label="Industry details" className="pt-16 md:pt-20 xl:pt-24">
        <div className="container-x">
          {industries.map((ind, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={ind.slug}
                id={ind.slug}
                className="border-border grid scroll-mt-28 grid-cols-1 items-center gap-x-8 gap-y-8 border-t py-14 lg:grid-cols-12 lg:py-20"
              >
                <div className={cn("lg:col-span-6", reverse && "lg:order-2")}>
                  <ClipReveal className="aspect-[16/10] overflow-hidden rounded-md">
                    <ParallaxImage
                      src={ind.image.src}
                      alt={ind.image.alt}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      containerClassName="h-full w-full"
                      strength={0.05}
                      className="saturate-[0.75]"
                    />
                  </ClipReveal>
                </div>
                <div className={cn("lg:col-span-5", reverse ? "lg:order-1" : "lg:col-start-8")}>
                  <Reveal>
                    <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em]">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(industries.length).padStart(2, "0")}
                    </p>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <h2 className="text-h2 mt-4 font-semibold">{ind.title}</h2>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <p className="text-lead mt-4">{ind.summary}</p>
                  </Reveal>
                  <Reveal delay={0.18}>
                    <p className="text-body text-muted-foreground mt-4 max-w-[54ch]">
                      {ind.description}
                    </p>
                  </Reveal>
                  <Reveal delay={0.24} className="mt-8">
                    <Button href="/contact" variant="ghost">
                      Discuss a {ind.title.toLowerCase()} programme
                    </Button>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
      <FinalCTA />
    </>
  );
}
