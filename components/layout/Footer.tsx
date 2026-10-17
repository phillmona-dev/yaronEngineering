import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { company } from "@/lib/data/company";
import { footerNav, legalNav } from "@/lib/data/navigation";
import { GridLines } from "@/components/ui/Backdrop";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-theme="dark"
      className="border-border bg-ink-950 text-foreground relative overflow-hidden border-t"
    >
      <GridLines className="text-white opacity-40" />
      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-1 md:py-20 lg:grid-cols-12 lg:py-24">
          <div className="md:col-span-5 lg:col-span-5">
            <Logo />
            <p className="text-muted-foreground mt-6 max-w-[40ch] text-[0.9375rem] leading-relaxed">
              ICT infrastructure and cybersecurity consulting and system integration for government,
              financial institutions, enterprises and NGOs across Ethiopia and East Africa.
            </p>
            <div className="mt-8 flex flex-col gap-2 text-sm">
              <a
                href={`mailto:${company.contact.email}`}
                className="text-foreground hover:text-brand-text w-fit"
              >
                {company.contact.email}
              </a>
              {company.contact.phones.map((p, i) => (
                <a
                  key={p}
                  href={`tel:${company.contact.phonesE164[i]}`}
                  className="text-foreground hover:text-brand-text w-fit"
                >
                  {p}
                </a>
              ))}
              <p className="text-muted-foreground mt-2 max-w-[36ch]">{company.headquarters.full}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {footerNav.map((group) => (
              <div key={group.heading}>
                <p className="eyebrow text-gold-400">{group.heading}</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-ink-200 text-[0.9375rem] transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 md:col-span-1">
              <p className="eyebrow text-gold-400">Start a project</p>
              <Link
                href="/contact"
                className="group mt-5 inline-flex items-center gap-2 text-[0.9375rem] text-white"
              >
                Talk to our engineers
                <ArrowUpRight
                  className="text-gold-400 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </Link>
              {company.social.length > 0 && (
                <ul className="mt-6 flex gap-4">
                  {company.social.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        className="text-ink-300 text-sm hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="border-border text-ink-400 flex flex-col gap-4 border-t py-6 font-mono text-[0.7rem] tracking-[0.12em] uppercase md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalNav.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
            <span className="hidden md:inline">
              {company.headquarters.city} · {company.headquarters.geo.lat.toFixed(2)}°N{" "}
              {company.headquarters.geo.lng.toFixed(2)}°E
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
