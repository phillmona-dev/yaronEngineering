"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { AdminButton } from "./ui";
import { NewPasswordFields, passwordIsValid } from "./PasswordFields";

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <div className="border-gold-500/40 bg-gold-500/15 text-gold-700 flex items-start gap-3 rounded-md border px-3 py-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>This reset link is incomplete. Open the link from your email, or request a new one.</p>
        </div>
        <Link href="/admin/forgot-password" className="text-brand-700 text-sm hover:underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passwordIsValid(password, confirm)) {
      setFieldError("Please satisfy every rule below.");
      return;
    }
    setError("");
    setFieldError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const fe = (json.errors as { field: string; message: string }[] | undefined)?.find(
          (x) => x.field === "newPassword",
        );
        if (fe) setFieldError(`Password ${fe.message}.`);
        throw new Error(json.message ?? "Password reset failed");
      }
      router.replace("/admin/login?reset=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <h1 className="text-ink-900 text-base font-semibold">Choose a new password</h1>
        <p className="text-ink-500 mt-1 text-sm">
          You&apos;ll be signed out everywhere else once the new password is saved.
        </p>
      </div>
      <NewPasswordFields
        password={password}
        confirm={confirm}
        onPassword={setPassword}
        onConfirm={setConfirm}
        error={fieldError}
        autoFocus
      />
      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}{" "}
          {/invalid|expired/i.test(error) && (
            <Link href="/admin/forgot-password" className="font-medium underline">
              Request a new link
            </Link>
          )}
        </p>
      )}
      <AdminButton type="submit" variant="primary" loading={loading} className="mt-2 h-10">
        Save new password
      </AdminButton>
    </form>
  );
}
