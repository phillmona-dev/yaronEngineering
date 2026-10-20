"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { admin } from "@/lib/admin/client";
import type { SiteContentDoc } from "@/lib/blog/types";
import { SECTIONS } from "@/lib/content/schema";
import { Card, PageHeader } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";

/** Overview of every editable part of the website, with its current status. */
export function ContentIndex() {
  const toast = useToast();
  const [docs, setDocs] = useState<Record<string, SiteContentDoc> | null>(null);

  useEffect(() => {
    admin
      .get<SiteContentDoc[]>("site-content")
      .then((list) => setDocs(Object.fromEntries(list.map((d) => [d.section, d]))))
      .catch((e) => toast("error", e.message));
  }, [toast]);

  const customised = docs ? Object.keys(docs).length : 0;

  return (
    <>
      <PageHeader
        title="Website content"
        description="Change the words, pictures, lists and links of the public website. Pick a section below, edit what you need and press Save — the live site updates straight away."
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Globe className="text-brand-700 mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="text-ink-900 font-medium">How it works</p>
              <p className="text-ink-500 mt-0.5 max-w-[70ch]">
                Every section starts with the website&apos;s built-in content. When you save a
                section it becomes
                <strong className="text-ink-900 font-medium"> customised</strong>; “Restore
                built-in” puts the original back at any time. Fields marked{" "}
                <span className="text-gold-700">*</span> must be filled in.
              </p>
            </div>
          </div>
          <p className="text-ink-500 shrink-0 text-xs">
            {docs ? `${customised} of ${SECTIONS.length} sections customised` : "Loading…"}
          </p>
        </div>
      </Card>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((s) => {
          const doc = docs?.[s.id];
          const Icon = s.icon;
          return (
            <li key={s.id}>
              <Link
                href={`/admin/content/${s.id}`}
                className="glass group flex h-full flex-col p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-24px_rgba(21,64,166,0.35)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-brand-500/10 text-brand-700 grid size-10 shrink-0 place-items-center rounded-lg">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span
                    className={
                      doc
                        ? "bg-brand-500/10 text-brand-700 ring-brand-500/20 rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium ring-1 ring-inset"
                        : "bg-ink-900/6 text-ink-500 ring-ink-900/10 rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium ring-1 ring-inset"
                    }
                  >
                    {docs === null ? "…" : doc ? "Customised" : "Built-in"}
                  </span>
                </div>
                <h2 className="text-ink-900 mt-4 text-base font-semibold">{s.title}</h2>
                <p className="text-ink-500 mt-1 flex-1 text-sm leading-relaxed">{s.summary}</p>
                <p className="text-ink-400 mt-4 text-xs">
                  {doc
                    ? `Last saved ${new Date(doc.updatedAt).toLocaleDateString()}`
                    : `Appears on: ${s.appearsOn[0]}`}
                </p>
                <span className="text-brand-700 mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                  Edit section
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
