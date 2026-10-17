import type { Metadata } from "next";
import { PageHero } from "@/components/hero/PageHero";
import { SolutionsProcess } from "@/components/sections/SolutionsProcess";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solutions",
  description:
    "Every Yaron Engineering solution is tailored to organizational objectives, performance, regulatory and security requirements, scalability and business continuity.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Solutions", path: "/solutions" }])} />
      <PageHero
        eyebrow="Solutions"
        crumbs={[{ label: "Solutions", href: "/solutions" }]}
        title={[
          <span key="a">Technology built around</span>,
          <span key="b">
            your <span className="text-gold-400">mission.</span>
          </span>,
        ]}
        lead="One disciplined method — discover, architect, integrate, secure, operate, scale — applied to every organization we serve."
        image={{
          src: "/images/photos/cloud-nodes.jpg",
          alt: "Abstract network of connected nodes",
          position: "center 40%",
        }}
      />
      <SolutionsProcess showCta={false} />
      <ServicesShowcase />
      <FinalCTA />
    </>
  );
}
