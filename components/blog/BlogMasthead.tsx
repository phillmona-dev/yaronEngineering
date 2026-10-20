import Link from "next/link";
import { GridLines } from "@/components/ui/Backdrop";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { SearchForm } from "./SearchForm";

type Crumb = { label: string; href: string };

/** Compact dark masthead for blog index pages (category, tag, author, search). */
export function BlogMasthead({
  eyebrow,
  title,
  lead,
  crumbs,
  search,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode[];
  lead?: React.ReactNode;
  crumbs?: Crumb[];
  search?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      data-theme="dark"
      className="bg-ink-950 text-foreground relative overflow-hidden pt-32 pb-14 lg:pt-40 lg:pb-16"
    >
      <GridLines className="text-white opacity-50" />
      <div className="container-x relative">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="text-ink-400 font-label flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href="/blog" className="hover:text-white">
                  Insights
                </Link>
              </li>
              {crumbs?.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === (crumbs?.length ?? 0) - 1 ? (
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
        <Reveal delay={0.05}>
          <p className="eyebrow text-ink-300">
            <span aria-hidden className="bg-gold-500 h-px w-6" />
            {eyebrow}
          </p>
        </Reveal>
        <TextReveal
          as="h1"
          delay={0.15}
          className="text-h1 mt-6 max-w-[18ch] font-semibold text-white"
          lines={title}
        />
        {lead && (
          <Reveal delay={0.35}>
            <p className="text-lead text-ink-300 mt-6 max-w-[56ch]">{lead}</p>
          </Reveal>
        )}
        {search && (
          <Reveal delay={0.4} className="mt-8 max-w-2xl">
            <SearchForm size="lg" />
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
