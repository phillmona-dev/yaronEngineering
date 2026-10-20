import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { IndustryContent as Industry } from "@/lib/content/types";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { TiltCard } from "@/components/animations/TiltCard";

export function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  return (
    <TiltCard className="h-full rounded-md">
      <Link
        href={`/industries#${industry.slug}`}
        className="group border-border bg-ink-900 relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-md border p-5 outline-none sm:aspect-[3/4] lg:p-6"
      >
        <ParallaxImage
          src={industry.image.src}
          alt={industry.image.alt}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
          absolute
          strength={0.06}
          className="duotone-media opacity-85 transition-[transform,opacity] duration-700 group-hover:scale-[1.04] group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <div aria-hidden className="duotone-shadows absolute inset-0" />
        <div aria-hidden className="duotone-lights absolute inset-0" />
        <div aria-hidden className="image-overlay absolute inset-0" />
        <span
          aria-hidden
          className="bg-gold-500 ease-out-expo absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        />
        <span className="text-ink-300 font-label absolute top-5 left-5 text-[0.7rem] font-semibold tracking-[0.14em] lg:top-6 lg:left-6">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="relative flex items-end justify-between gap-3">
          <span>
            <span className="text-h4 group-hover:text-gold-400 block font-semibold text-white transition-colors duration-300">
              {industry.title}
            </span>
            <span className="text-ink-300 text-body mt-2 hidden sm:block">{industry.summary}</span>
          </span>
          <ArrowUpRight
            className="text-ink-300 mb-1 size-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
      </Link>
    </TiltCard>
  );
}
