"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { primaryNav } from "@/lib/data/navigation";
import { company } from "@/lib/data/company";
import { EASE_OUT_EXPO } from "@/lib/utils/motion";

type Props = { open: boolean; onClose: () => void };

const links = [
  ...primaryNav,
  { label: "Partners", href: "/partners" },
  { label: "Careers", href: "/careers" },
];

export function MobileMenu({ open, onClose }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          key="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          className="bg-ink-950 fixed inset-0 z-[55] flex flex-col text-white lg:hidden"
        >
          <div aria-hidden className="grid-lines absolute inset-0 text-white opacity-60" />
          <div className="container-x relative flex h-[72px] shrink-0 items-center" />
          <nav className="container-x relative flex flex-1 flex-col justify-center pb-12">
            <m.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }}
              className="flex flex-col"
            >
              {links.map((item, i) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <m.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
                      },
                    }}
                    className="border-b border-white/[0.08]"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-baseline justify-between py-4 text-[2rem] font-semibold tracking-[-0.025em] sm:text-[2.5rem]",
                        active ? "text-brand-300" : "text-white",
                      )}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="text-ink-400 font-mono text-[0.7rem] tracking-[0.14em]">
                          0{i + 1}
                        </span>
                        {item.label}
                      </span>
                      <ArrowUpRight className="text-ink-400 size-5" strokeWidth={1.5} aria-hidden />
                    </Link>
                  </m.li>
                );
              })}
            </m.ul>
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT_EXPO }}
              className="mt-8 flex flex-col gap-4"
            >
              <Button
                href="/contact"
                size="lg"
                arrow={false}
                onClick={onClose}
                className="w-full"
              >
                Contact Us
              </Button>
              <div className="text-ink-400 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.72rem] tracking-[0.14em] uppercase">
                <span>
                  {company.headquarters.city}, {company.headquarters.country}
                </span>
                <a
                  href={`mailto:${company.contact.email}`}
                  className="tracking-normal normal-case hover:text-white"
                >
                  {company.contact.email}
                </a>
              </div>
            </m.div>
          </nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
