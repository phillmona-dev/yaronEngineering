"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Inbox, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ArticleStatus } from "@/lib/blog/types";

/* ---------- Primitives for the admin (dense, neutral, no imagery) ---------- */

export const inputCls =
  "w-full rounded-lg border border-white/80 bg-white/70 px-3 py-2 text-sm text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(21,64,166,0.04)] backdrop-blur placeholder:text-ink-400 transition-[background,border-color,box-shadow] focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:bg-ink-50/60 aria-[invalid=true]:border-red-500";
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
    primary:
      "border-transparent bg-gradient-to-br from-[#3f82dc] to-[#6ca6ee] text-white shadow-[0_10px_24px_-10px_rgba(63,130,220,0.8)] hover:from-[#3270c8] hover:to-[#3f82dc] hover:shadow-[0_14px_28px_-10px_rgba(63,130,220,0.9)]",
    secondary:
      "border-white/80 bg-white/70 text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(21,64,166,0.05)] backdrop-blur hover:bg-white",
    ghost: "border-transparent bg-transparent text-ink-500 hover:bg-white/70 hover:text-ink-900",
    danger: "border-red-200/80 bg-white/70 text-red-600 backdrop-blur hover:bg-red-50",
  }[variant];
  const s = size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm";
  return (
    <button
      className={cn(
        "focus-visible:ring-brand-500/40 ease-out-expo inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium transition-[background,box-shadow,transform,color] duration-300 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] disabled:opacity-50",
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
    <section className={cn("glass overflow-hidden", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-white/70 bg-white/30 px-5 py-3.5">
          {title && <h2 className="text-ink-900 text-sm font-semibold">{title}</h2>}
          {action}
        </header>
      )}
      <div className={padded ? "p-5" : undefined}>{children}</div>
    </section>
  );
}

const statusStyles: Record<ArticleStatus, { pill: string; dot: string }> = {
  DRAFT: { pill: "bg-gold-500/15 text-gold-700 ring-gold-500/40", dot: "bg-gold-500" },
  SCHEDULED: { pill: "bg-brand-700/10 text-brand-700 ring-brand-700/20", dot: "bg-brand-700" },
  PUBLISHED: {
    pill: "bg-brand-500/10 text-brand-700 ring-brand-500/20",
    dot: "bg-brand-500",
  },
  ARCHIVED: { pill: "bg-ink-900/6 text-ink-500 ring-ink-900/10", dot: "bg-ink-400" },
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const s = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase ring-1 ring-inset",
        s.pill,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
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
        <h1 className="text-ink-900 text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
        {description && <p className="text-ink-500 mt-1 max-w-[64ch] text-sm">{description}</p>}
        <span
          aria-hidden
          className="mt-3 block h-1 w-12 rounded-full bg-gradient-to-r from-[#3f82dc] via-[#6ca6ee] to-[#f5c518]"
        />
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
      className="glass-fade bg-ink-950/35 fixed inset-0 z-[90] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="glass glass-strong glass-pop w-full max-w-md p-6"
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
      className="glass-fade bg-ink-950/35 fixed inset-0 z-[90] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "glass glass-strong glass-pop flex max-h-[90vh] w-full flex-col overflow-hidden",
          wide ? "max-w-4xl" : "max-w-lg",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-white/70 bg-white/30 px-5 py-3.5">
          <h2 className="text-ink-900 text-sm font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-400 hover:text-ink-900 rounded-lg p-1.5 hover:bg-white/80"
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
      <td colSpan={colSpan} className="px-4 py-14 text-center">
        <span className="bg-ink-900/5 text-ink-400 mx-auto mb-3 grid size-11 place-items-center rounded-2xl">
          <Inbox className="size-5" aria-hidden />
        </span>
        <p className="text-ink-400 text-sm">{text}</p>
      </td>
    </tr>
  );
}

/** Glass table chrome: horizontal scroll wrapper + consistent head/body styling. */
export const tableCls = "w-full";
export const theadCls = "border-b border-white/80 bg-white/35";
export const tbodyCls = "divide-y divide-white/70";
export const trCls = "transition-colors hover:bg-white/55";

export function Pagination({
  page,
  totalPages,
  last,
  onPage,
  labels = ["Previous", "Next"],
}: {
  page: number;
  totalPages: number;
  last: boolean;
  onPage: (p: number) => void;
  labels?: [string, string];
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="text-ink-500 flex items-center justify-between border-t border-white/70 bg-white/25 p-3 text-xs">
      <AdminButton size="sm" disabled={page === 0} onClick={() => onPage(page - 1)}>
        {labels[0]}
      </AdminButton>
      <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase">
        Page {page + 1} of {totalPages}
      </span>
      <AdminButton size="sm" disabled={last} onClick={() => onPage(page + 1)}>
        {labels[1]}
      </AdminButton>
    </div>
  );
}

/** Small translucent count chip for toolbars ("12 articles"). */
export function CountChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-ink-600 inline-flex items-center rounded-full border border-white/80 bg-white/60 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.1em] uppercase">
      {children}
    </span>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <div
                className="dash-shimmer h-3.5 rounded"
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
  "px-5 py-3.5 text-left font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-500 whitespace-nowrap";
export const td = "px-5 py-4 text-[0.9375rem] text-ink-900 align-middle";
