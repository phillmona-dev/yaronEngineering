"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ArticleStatus } from "@/lib/blog/types";

/* ---------- Primitives for the admin (dense, neutral, no imagery) ---------- */

export const inputCls =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-ink-50 aria-[invalid=true]:border-red-500";
export const labelCls = "mb-1.5 block text-xs font-medium text-ink-500";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-ink-400 mt-1 text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
};

export function AdminButton({
  variant = "secondary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...rest
}: BtnProps) {
  const v = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 border-transparent",
    secondary: "bg-white text-ink-900 border-ink-200 hover:bg-ink-50",
    ghost: "bg-transparent text-ink-500 border-transparent hover:bg-ink-50 hover:text-ink-900",
    danger: "bg-white text-red-600 border-red-200 hover:bg-red-50",
  }[variant];
  const s = size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm";
  return (
    <button
      className={cn(
        "focus-visible:ring-brand-500/40 inline-flex items-center justify-center gap-1.5 rounded-md border font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
        v,
        s,
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Card({
  title,
  action,
  children,
  className,
  padded = true,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("border-ink-200 rounded-lg border bg-white", className)}>
      {(title || action) && (
        <header className="border-ink-100 flex items-center justify-between border-b px-5 py-3">
          {title && <h2 className="text-ink-900 text-sm font-semibold">{title}</h2>}
          {action}
        </header>
      )}
      <div className={padded ? "p-5" : undefined}>{children}</div>
    </section>
  );
}

const statusStyles: Record<ArticleStatus, string> = {
  DRAFT: "bg-ink-100 text-ink-600",
  SCHEDULED: "bg-amber-100 text-amber-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  ARCHIVED: "bg-ink-100 text-ink-400 line-through",
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.1em] uppercase",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-ink-900 text-xl font-semibold tracking-[-0.01em]">{title}</h1>
        {description && <p className="text-ink-500 mt-1 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = "Confirm",
  danger,
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  text: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="bg-ink-950/40 fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="border-ink-200 w-full max-w-md rounded-lg border bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-ink-900 text-base font-semibold">
          {title}
        </h2>
        <p className="text-ink-500 mt-2 text-sm">{text}</p>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton onClick={onClose}>Cancel</AdminButton>
          <AdminButton
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="bg-ink-950/40 fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "border-ink-200 flex max-h-[90vh] w-full flex-col rounded-lg border bg-white shadow-xl",
          wide ? "max-w-4xl" : "max-w-lg",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-ink-100 flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-ink-900 text-sm font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-400 hover:bg-ink-50 hover:text-ink-900 rounded-md p-1"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-ink-400 px-4 py-12 text-center text-sm">
        {text}
      </td>
    </tr>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <div
                className="bg-ink-100 h-3.5 animate-pulse rounded"
                style={{ width: `${40 + ((r * 7 + c * 13) % 50)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export const th =
  "px-4 py-2.5 text-left font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-400";
export const td = "px-4 py-3 text-sm text-ink-900 align-middle";
