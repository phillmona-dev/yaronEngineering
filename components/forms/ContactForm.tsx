"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

const SUBJECTS = [
  "ICT infrastructure",
  "Data center facility",
  "ICT consultancy",
  "Cybersecurity",
  "Cloud services",
  "Servers & storage",
  "Physical & electronic security",
  "General enquiry",
];

const field =
  "w-full rounded-sm border border-border-strong bg-transparent px-4 py-3 text-[0.9375rem] text-foreground placeholder:text-muted-foreground/70 transition-colors duration-300 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-hover/40 aria-[invalid=true]:border-red-500";
const label =
  "mb-2 block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? ""))
      next.email = "Please enter a valid email address.";
    if (!data.subject) next.subject = "Please choose a subject.";
    if ((data.message ?? "").trim().length < 20)
      next.message = "Please describe your requirement in at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Request failed");
      setMessage(json.message ?? "Thank you — we will be in touch shortly.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Please email us directly.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-border bg-surface flex flex-col items-start gap-4 rounded-md border p-8"
      >
        <span className="bg-brand flex size-10 items-center justify-center rounded-full text-white">
          <Check className="size-5" strokeWidth={2} aria-hidden />
        </span>
        <p className="text-h4 font-semibold">Message received.</p>
        <p className="text-body text-muted-foreground max-w-[48ch]">{message}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-brand-text text-sm font-medium underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-6"
      aria-describedby="form-help"
    >
      <p id="form-help" className="sr-only">
        All fields except organization are required.
      </p>
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company_website">Website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={field}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-err" : undefined}
            placeholder="Full name"
          />
          {errors.name && (
            <p id="name-err" className="mt-2 text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={field}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-err" : undefined}
            placeholder="name@organization.com"
          />
          {errors.email && (
            <p id="email-err" className="mt-2 text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="organization" className={label}>
            Organization <span className="tracking-normal normal-case">(optional)</span>
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            className={field}
            placeholder="Institution or company"
          />
        </div>
        <div>
          <label htmlFor="subject" className={label}>
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className={cn(
              field,
              "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236e7a91%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10",
            )}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-err" : undefined}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p id="subject-err" className="mt-2 text-sm text-red-500">
              {errors.subject}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={cn(field, "resize-y")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-err" : undefined}
          placeholder="What are you building, protecting or transforming?"
        />
        {errors.message && (
          <p id="message-err" className="mt-2 text-sm text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-sm border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-500"
        >
          {message}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          arrow={status === "submitting" ? false : "right"}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <span className="flex items-center gap-2">
              Sending <Loader2 className="size-4 animate-spin" aria-hidden />
            </span>
          ) : (
            "Send message"
          )}
        </Button>
        <p className="text-muted-foreground text-sm">We respond within one business day.</p>
      </div>
    </form>
  );
}
