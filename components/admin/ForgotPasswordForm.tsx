"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AdminButton, Field, inputCls } from "./ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? "Request failed");
      setSent(json.message ?? "If an account exists for that email, a reset link has been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4" role="status">
        <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
          <MailCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">Check your inbox</p>
            <p className="mt-0.5">{sent}</p>
            <p className="mt-1 text-xs text-emerald-700/80">
              The link is valid for 30 minutes. Only the most recent link works.
            </p>
          </div>
        </div>
        <Link
          href="/admin/login"
          className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-ink-900 text-base font-semibold">Forgot your password?</h1>
        <p className="text-ink-500 mt-1 text-sm">
          Enter the email you sign in with and we&apos;ll send a one-time link to choose a new
          password.
        </p>
      </div>
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </Field>
      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <AdminButton type="submit" variant="primary" loading={loading} className="mt-2 h-10">
        Send reset link
      </AdminButton>
      <Link
        href="/admin/login"
        className="text-ink-500 hover:text-ink-900 inline-flex items-center gap-1.5 self-start text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to sign in
      </Link>
    </form>
  );
}
