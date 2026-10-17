"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { GridLines, Glow } from "@/components/ui/Backdrop";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "done" | "error";

export function NewsletterCTA({
  heading = "Stay ahead of the technology curve",
  text = "Receive Yaron Engineering's latest insights on infrastructure, cybersecurity, cloud and enterprise technology.",
}: {
  heading?: string;
  text?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog" }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      data-theme="dark"
      className="border-border bg-ink-950 text-foreground relative overflow-hidden rounded-md border px-6 py-12 lg:px-14 lg:py-16"
      aria-labelledby="newsletter-title"
    >
      <GridLines className="text-white opacity-50" />
      <Glow className="-top-24 -right-24 h-80 w-80 opacity-60" />
      <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="eyebrow text-ink-300">Newsletter</p>
          <h2 id="newsletter-title" className="text-h2 mt-4 max-w-[18ch] font-semibold text-white">
            {heading}
          </h2>
          <p className="text-body text-ink-300 mt-4 max-w-[52ch]">{text}</p>
        </div>
        <div className="lg:col-span-5">
          {status === "done" ? (
            <p
              role="status"
              className="border-border text-ink-100 flex items-center gap-3 rounded-sm border p-4 text-sm"
            >
              <span className="bg-brand flex size-7 items-center justify-center rounded-full text-white">
                <Check className="size-4" aria-hidden />
              </span>
              Thank you. Your subscription is pending confirmation.
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
              <label
                htmlFor="newsletter-email"
                className="text-ink-400 font-mono text-[0.66rem] tracking-[0.14em] uppercase"
              >
                Work email
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@organization.com"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "newsletter-err" : undefined}
                  className="border-border-strong placeholder:text-ink-400 focus:border-brand-400 h-12 flex-1 rounded-sm border bg-transparent px-4 text-[0.9375rem] text-white focus:outline-none"
                />
                <Button
                  type="submit"
                  size="md"
                  arrow="right"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              {error && (
                <p id="newsletter-err" className="text-sm text-red-400">
                  {error}
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="text-sm text-red-400">
                  We couldn&apos;t subscribe you right now. Please try again later.
                </p>
              )}
              <p className="text-ink-400 text-xs">No spam. Unsubscribe at any time.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
