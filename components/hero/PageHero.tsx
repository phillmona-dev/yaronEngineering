import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { GridLines } from "@/components/ui/Backdrop";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils/cn";
import { HeroOrbits } from "./HeroOrbits";

type Crumb = { label: string; href: string };

type Props = {
  eyebrow: string;
  title: React.ReactNode[];
  lead?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  compact?: boolean;
};

/** Inner-page hero: brand-blue gradient composition (no photography) with line-by-line title reveal. */
export function PageHero({ eyebrow, title, lead, crumbs, children, compact }: Props) {
  return (
    <section
      data-theme="dark"
      className={cn(
        "bg-ink-950 text-foreground relative isolate overflow-hidden",
        compact ? "pt-32 pb-12 lg:pt-36 lg:pb-14" : "pt-32 pb-14 lg:pt-40 lg:pb-20",
      )}
    >
      <div className="absolute inset-0 -z-10">
        <div aria-hidden className="hero-mesh absolute inset-0" />
        <div
          aria-hidden
          className="hero-blob top-[-30%] right-[5%] h-[40vw] max-h-[560px] w-[40vw] max-w-[560px] opacity-70"
          style={{
            background: "radial-gradient(closest-side, rgba(108,166,238,0.55), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="hero-blob bottom-[-40%] left-[-8%] h-[30vw] max-h-[420px] w-[30vw] max-w-[420px] opacity-60 [animation-delay:-8s]"
          style={{
            background: "radial-gradient(closest-side, rgba(245,197,24,0.25), transparent 70%)",
          }}
        />
        <HeroOrbits className="absolute top-1/2 right-[-18%] hidden w-[46vw] max-w-[760px] -translate-y-1/2 opacity-70 lg:block" />
        <div
          aria-hidden
          className="from-gold-500/0 via-gold-500/45 to-gold-500/0 absolute top-0 right-[30%] hidden h-[160%] w-px origin-top rotate-[22deg] bg-gradient-to-b lg:block"
        />
      </div>
      <GridLines className="text-white opacity-40" />
      <div className="container-x relative">
        {/* ── Back button ─────────────────────────────────────────────────── */}
        <Reveal>
          <BackButton className="mb-8" />
        </Reveal>

        {crumbs && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="text-ink-400 font-label flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
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
          className="text-h1 mt-7 max-w-[16ch] font-bold text-white"
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
