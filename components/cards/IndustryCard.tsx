import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Industry } from "@/lib/data/industries";

export function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  return (
    <Link
      href={`/industries#${industry.slug}`}
      className="group border-border bg-ink-900 relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-md border p-5 outline-none sm:aspect-[3/4] lg:p-6"
    >
      <Image
        src={industry.image.src}
        alt={industry.image.alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
        className="ease-out-expo object-cover opacity-60 saturate-[0.65] transition-[transform,opacity,filter] duration-700 group-hover:scale-[1.04] group-hover:opacity-90 group-hover:saturate-100 group-focus-visible:opacity-90"
      />
      <div aria-hidden className="image-overlay absolute inset-0" />
      <span
        aria-hidden
        className="bg-brand-400 ease-out-expo absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
      />
      <span className="text-ink-300 absolute top-5 left-5 font-mono text-[0.68rem] tracking-[0.14em] lg:top-6 lg:left-6">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="relative flex items-end justify-between gap-3">
        <span>
          <span className="text-h4 group-hover:text-brand-300 block font-semibold text-white transition-colors duration-300">
            {industry.title}
          </span>
          <span className="text-ink-300 mt-2 hidden text-[0.8125rem] leading-snug sm:block">
            {industry.summary}
          </span>
        </span>
        <ArrowUpRight
          className="text-ink-300 mb-1 size-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
    </Link>
  );
}
