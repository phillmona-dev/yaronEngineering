import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div
      data-theme="light"
      className="bg-ink-50 text-ink-900 flex min-h-screen items-center justify-center p-6"
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <LogoMark size={36} />
          <div>
            <p className="text-base font-semibold">Yaron CMS</p>
            <p className="text-ink-400 font-mono text-[0.62rem] tracking-[0.14em] uppercase">
              Knowledge Hub · Sign in
            </p>
          </div>
        </div>
        <div className="border-ink-200 rounded-lg border bg-white p-6 shadow-sm">
          <Suspense fallback={<div className="bg-ink-100 h-48 animate-pulse rounded" />}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-ink-400 mt-6 text-center text-xs">
          Authorised Yaron Engineering staff only.
        </p>
      </div>
    </div>
  );
}
