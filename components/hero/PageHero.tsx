import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { GridLines } from "@/components/ui/Backdrop";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils/cn";

type Crumb = { label: string; href: string };

type Props = {
  eyebrow: string;
  title: React.ReactNode[];
  lead?: React.ReactNode;
  image?: { src: string; alt: string; position?: string };
  crumbs?: Crumb[];
  children?: React.ReactNode;
  compact?: boolean;
};

/** Inner-page hero: dark, image-backed, with line-by-line title reveal and breadcrumb. */
export function PageHero({ eyebrow, title, lead, image, crumbs, children, compact }: Props) {
  return (
    <section
      data-theme="dark"
      className={cn(
        "bg-ink-950 text-foreground relative isolate overflow-hidden",
        compact ? "pt-36 pb-16 lg:pt-44 lg:pb-20" : "pt-40 pb-20 lg:pt-56 lg:pb-28",
      )}
    >
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
            style={{ objectPosition: image.position ?? "center" }}
          />
          <div
            aria-hidden
            className="from-ink-950 via-ink-950/80 to-ink-950/50 absolute inset-0 bg-gradient-to-t"
          />
          <div
            aria-hidden
            className="from-ink-950/80 via-ink-950/30 absolute inset-0 bg-gradient-to-r to-transparent"
          />
        </div>
      )}
      <GridLines className="text-white opacity-50" />
      <div className="container-x relative">
        {/* ── Back button ─────────────────────────────────────────────────── */}
        <Reveal>
          <BackButton className="mb-8" />
        </Reveal>

        {crumbs && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="text-ink-400 flex flex-wrap items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex items-center gap-2">
                    <span aria-hidden>/</span>
                    {i === crumbs.length - 1 ? (
                      <span aria-current="page" className="text-ink-200">
                        {c.label}
                      </span>
                    ) : (
                      <Link href={c.href} className="hover:text-white">
                        {c.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <Eyebrow className="text-ink-300">{eyebrow}</Eyebrow>
        </Reveal>
        <TextReveal
          as="h1"
          delay={0.2}
          className="text-h1 mt-7 max-w-[16ch] font-semibold text-white"
          lines={title}
        />
        {lead && (
          <Reveal delay={0.45}>
            <p className="text-lead text-ink-200 mt-7 max-w-[56ch]">{lead}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
