import Image from "next/image";
import type { PartnerContent as Partner } from "@/lib/content/types";

/**
 * Partner slot: renders the official logo when supplied, otherwise a restrained typographic
 * wordmark so the grid stays elegant until assets arrive. When a website is known, clicking
 * opens it in a new tab.
 */
export function PartnerSlot({ partner }: { partner: Partner }) {
  const Wrapper = partner.url ? "a" : "div";
  const linkProps = partner.url
    ? {
        href: partner.url,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `Visit ${partner.name} official website`,
      }
    : {};
  return (
    <Wrapper
      {...linkProps}
      className="group border-border hover:bg-surface flex aspect-[5/3] flex-col items-center justify-center gap-2 border-r border-b p-6 transition-colors duration-300"
      title={`${partner.name} · ${partner.category}`}
    >
      {partner.logo ? (
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={240}
          height={120}
          className="h-9 w-auto max-w-[140px] object-contain opacity-75 transition-[opacity,transform] duration-300 ease-out will-change-transform group-hover:-translate-y-1.5 group-hover:scale-125 group-hover:opacity-100 lg:h-10"
        />
      ) : (
        <>
          <span className="text-ink-400 group-hover:text-brand-text text-center text-[1.05rem] font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-[1.2rem]">
            {partner.name}
          </span>
          <span className="text-ink-300 font-label text-[0.7rem] font-semibold tracking-[0.14em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {partner.category}
          </span>
        </>
      )}
    </Wrapper>
  );
}
