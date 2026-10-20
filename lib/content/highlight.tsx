import { cn } from "@/lib/utils/cn";
import type { HeroCopy } from "./types";

/**
 * Renders `text` with the first occurrence of `highlight` wrapped in a coloured span — the
 * device every headline on the site uses for its accent word. When the highlight is empty or
 * not found the text renders unchanged, so an editor can never break a heading.
 */
export function Highlight({
  text,
  highlight,
  className = "text-brand-text",
}: {
  text: string;
  highlight?: string;
  className?: string;
}) {
  const h = highlight?.trim();
  if (!h) return <>{text}</>;
  const i = text.indexOf(h);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className={cn(className)}>{h}</span>
      {text.slice(i + h.length)}
    </>
  );
}

/** Helper for the gold accent used on dark heroes. */
export function GoldHighlight(props: { text: string; highlight?: string }) {
  return <Highlight {...props} className="text-gold-400" />;
}

/** Derived helpers kept in one place so every consumer formats them the same way. */
export function phoneToE164(display: string): string {
  return display.replace(/[^\d+]/g, "");
}

export function whatsappHref(e164: string, greeting: string): string {
  const number = e164.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(greeting)}`;
}

/** Props for `PageHero` built from an editable page section. */
export function pageHeroProps(copy: HeroCopy) {
  return {
    eyebrow: copy.eyebrow,
    title: [
      <span key="a">{copy.titleLine1}</span>,
      <span key="b">
        <GoldHighlight text={copy.titleLine2} highlight={copy.highlight} />
      </span>,
    ],
    lead: copy.lead,
  };
}
