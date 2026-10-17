"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  Eye,
  ExternalLink,
  FileText,
  Inbox,
  Layers,
  PenLine,
  PenSquare,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import { admin } from "@/lib/admin/client";
import type { ArticleStatus, ContactStatus, DashboardStats, User } from "@/lib/blog/types";
import { StatusBadge } from "./ui";
import { formatDateTime, mediaUrl, timeAgo } from "@/lib/blog/format";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

function useCountUp(target: number | undefined, duration = 900) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === undefined) return;
    if (reduce || target === 0) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);
  return value;
}

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function pct(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

type Accent = "blue" | "emerald" | "amber" | "violet" | "cyan" | "orange";
const accents: Record<Accent, { chip: string; glow: string; text: string; bar: string }> = {
  blue: {
    chip: "from-[#3f82dc] to-[#a6ccf7] text-white",
    glow: "shadow-[0_12px_30px_-10px_rgba(63,130,220,0.7)]",
    text: "text-[#3f82dc]",
    bar: "from-[#3f82dc] to-[#a6ccf7]",
  },
  emerald: {
    chip: "from-[#d9a90c] to-[#fbd84a] text-[#143070]",
    glow: "shadow-[0_12px_30px_-10px_rgba(245,197,24,0.6)]",
    text: "text-gold-700",
    bar: "from-gold-600 to-gold-400",
  },
  amber: {
    chip: "from-[#3f82dc] to-[#a6ccf7] text-white",
    glow: "shadow-[0_12px_30px_-10px_rgba(63,130,220,0.7)]",
    text: "text-[#3f82dc]",
    bar: "from-[#3f82dc] to-[#a6ccf7]",
  },
  violet: {
    chip: "from-[#d9a90c] to-[#fbd84a] text-[#143070]",
    glow: "shadow-[0_12px_30px_-10px_rgba(245,197,24,0.6)]",
    text: "text-gold-700",
    bar: "from-gold-600 to-gold-400",
  },
  cyan: {
    chip: "from-[#3f82dc] to-[#a6ccf7] text-white",
    glow: "shadow-[0_12px_30px_-10px_rgba(63,130,220,0.7)]",
    text: "text-[#3f82dc]",
    bar: "from-[#3f82dc] to-[#a6ccf7]",
  },
  orange: {
    chip: "from-[#d9a90c] to-[#fbd84a] text-[#143070]",
    glow: "shadow-[0_12px_30px_-10px_rgba(245,197,24,0.6)]",
    text: "text-gold-700",
    bar: "from-gold-600 to-gold-400",
  },
};

/* ------------------------------------------------------------------ */
/* KPI tile                                                             */
/* ------------------------------------------------------------------ */

function Kpi({
  label,
  value,
  accent,
  icon: Icon,
  foot,
  href,
  format = (n) => n.toLocaleString(),
}: {
  label: string;
  value: number | undefined;
  accent: Accent;
  icon: React.ComponentType<{ className?: string }>;
  foot?: React.ReactNode;
  href?: string;
  format?: (n: number) => string;
}) {
  const n = useCountUp(value);
  const a = accents[accent];
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-2xl bg-gradient-to-br",
            a.chip,
            a.glow,
          )}
        >
          <Icon className="size-5" />
        </span>
        {href && (
          <ArrowUpRight
            className="text-ink-300 group-hover:text-ink-900 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        )}
      </div>
      <p className="text-ink-900 mt-4 text-[2rem] leading-none font-semibold tracking-[-0.03em] tabular-nums">
        {value === undefined ? <span className="text-ink-300">–</span> : format(n)}
      </p>
      <p className="text-ink-500 mt-1.5 text-[0.8rem] font-medium">{label}</p>
      {foot && <div className="mt-3 text-xs">{foot}</div>}
    </>
  );
  const cls =
    "glass group block p-5 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgba(14,34,80,0.4)]";
  return href ? (
    <m.div variants={item}>
      <Link href={href} className={cls}>
        {body}
      </Link>
    </m.div>
  ) : (
    <m.div variants={item} className={cls}>
      {body}
    </m.div>
  );
}

function Delta({ now, prev }: { now: number; prev: number }) {
  if (prev === 0 && now === 0) return <span className="text-ink-400">No views yet</span>;
  const diff = now - prev;
  const up = diff >= 0;
  const p = prev === 0 ? 100 : Math.round((Math.abs(diff) / prev) * 100);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
        up ? "bg-brand-500/10 text-brand-700" : "bg-ink-900/8 text-ink-500",
      )}
    >
      {up ? (
        <ArrowUpRight className="size-3.5" aria-hidden />
      ) : (
        <ArrowDownRight className="size-3.5" aria-hidden />
      )}
      {p}% <span className="font-normal opacity-70">vs prior 7d</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Views chart                                                          */
/* ------------------------------------------------------------------ */

function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function ViewsChart({ data }: { data: { date: string; views: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  const H = 220;
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w > 0) setW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const padL = 34;
  const padR = 12;
  const padT = 14;
  const padB = 28;
  const max = Math.max(1, ...data.map((d) => d.views));
  const niceMax = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
  const x = (i: number) => padL + (i * (W - padL - padR)) / Math.max(1, data.length - 1);
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / niceMax);
  const pts = data.map(
    (d, i) => [Number(x(i).toFixed(1)), Number(y(d.views).toFixed(1))] as [number, number],
  );
  const line = smoothPath(pts);
  const area = `${line} L${pts[pts.length - 1]?.[0] ?? padL},${H - padB} L${padL},${H - padB} Z`;
  const gridVals = [0, niceMax / 2, niceMax];

  const onMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const el = ref.current;
      if (!el || !data.length) return;
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const i = Math.round(((px - padL) / (W - padL - padR)) * (data.length - 1));
      setHover(Math.max(0, Math.min(data.length - 1, i)));
    },
    [data.length, W],
  );

  if (!data.length) return <p className="text-ink-400 text-sm">No view data yet.</p>;
  const h = hover !== null ? data[hover] : null;
  const label = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div ref={wrap} className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="h-[220px] w-full touch-none select-none"
        role="img"
        aria-label={`Article views over the last ${data.length} days, peaking at ${max}`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="dash-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3f82dc" stopOpacity="0.35" />
            <stop offset="0.6" stopColor="#6ca6ee" stopOpacity="0.08" />
            <stop offset="1" stopColor="#6ca6ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dash-stroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#3f82dc" />
            <stop offset="0.55" stopColor="#6ca6ee" />
            <stop offset="1" stopColor="#a6ccf7" />
          </linearGradient>
          <filter id="dash-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {gridVals.map((g) => (
          <g key={g}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(g)}
              y2={y(g)}
              stroke="rgba(14,34,80,0.08)"
              strokeDasharray={g === 0 ? undefined : "3 5"}
            />
            <text
              x={padL - 8}
              y={y(g) + 3.5}
              textAnchor="end"
              fontSize="10"
              fill="#6480b8"
              fontFamily="var(--font-geist-mono)"
            >
              {g}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#dash-area)" />
        <path
          d={line}
          fill="none"
          stroke="url(#dash-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#dash-glow)"
        />
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
            fontSize="10"
            fill="#6480b8"
            fontFamily="var(--font-geist-mono)"
          >
            {label(data[i].date)}
          </text>
        ))}
        {h && hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={padT}
              y2={H - padB}
              stroke="rgba(63,130,220,0.35)"
              strokeDasharray="3 4"
            />
            <circle cx={x(hover)} cy={y(h.views)} r="9" fill="rgba(63,130,220,0.15)" />
            <circle
              cx={x(hover)}
              cy={y(h.views)}
              r="4.5"
              fill="#fff"
              stroke="#3f82dc"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div
          className="glass glass-strong pointer-events-none absolute -top-2 z-10 min-w-[7.5rem] rounded-xl px-3 py-2 text-xs"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: `translateX(${hover > data.length * 0.75 ? "-100%" : hover < data.length * 0.25 ? "0%" : "-50%"})`,
          }}
        >
          <p className="text-ink-400 font-mono text-[0.62rem] tracking-[0.1em] uppercase">
            {label(h.date)}
          </p>
          <p className="text-ink-900 mt-0.5 text-base font-semibold tabular-nums">
            {h.views.toLocaleString()}{" "}
            <span className="text-ink-500 text-xs font-normal">
              {h.views === 1 ? "view" : "views"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status donut                                                         */
/* ------------------------------------------------------------------ */

function Donut({
  parts,
  total,
}: {
  parts: { label: string; value: number; color: string; status: ArticleStatus }[];
  total: number;
}) {
  const reduce = useReducedMotion();
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 140 140" className="size-36 -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(14,34,80,0.07)" strokeWidth="14" />
          {parts.map((p) => {
            const len = total === 0 ? 0 : (p.value / total) * c;
            const el = (
              <m.circle
                key={p.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={p.color}
                strokeWidth="14"
                strokeLinecap={len > 0 && len < c ? "round" : "butt"}
                strokeDasharray={`${len} ${c - len}`}
                initial={reduce ? false : { strokeDashoffset: 0, opacity: 0 }}
                animate={{ strokeDashoffset: -offset, opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                style={reduce ? { strokeDashoffset: -offset } : undefined}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-ink-900 text-2xl leading-none font-semibold tabular-nums">{total}</p>
            <p className="text-ink-400 mt-1 font-mono text-[0.58rem] tracking-[0.12em] uppercase">
              articles
            </p>
          </div>
        </div>
      </div>
      <ul className="grid flex-1 gap-2.5">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2.5 text-sm">
            <span className="size-2.5 rounded-full" style={{ background: p.color }} aria-hidden />
            <span className="text-ink-600 flex-1">{p.label}</span>
            <span className="text-ink-900 font-medium tabular-nums">{p.value}</span>
            <span className="text-ink-400 w-9 text-right font-mono text-[0.62rem] tabular-nums">
              {pct(p.value, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                                */
/* ------------------------------------------------------------------ */

function Panel({
  title,
  icon: Icon,
  action,
  children,
  className,
  padded = true,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <m.section variants={item} className={cn("glass flex flex-col overflow-hidden", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-white/70 px-5 py-3.5">
        <h2 className="text-ink-900 flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
          {Icon && <Icon className="text-ink-400 size-4" />}
          {title}
        </h2>
        {action}
      </header>
      <div className={cn("flex-1", padded && "p-5")}>{children}</div>
    </m.section>
  );
}

function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-brand-600 hover:bg-brand-500/10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
    >
      {children} <ArrowUpRight className="size-3.5" aria-hidden />
    </Link>
  );
}

const messageTone: Record<ContactStatus, string> = {
  NEW: "bg-gold-500/15 text-gold-700",
  READ: "bg-ink-900/8 text-ink-500",
  REPLIED: "bg-brand-500/10 text-brand-700",
  ARCHIVED: "bg-ink-900/8 text-ink-400",
};

function Empty({ text }: { text: string }) {
  return <p className="text-ink-400 px-5 py-6 text-center text-sm">{text}</p>;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("dash-shimmer rounded-lg", className)} aria-hidden />;
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                            */
/* ------------------------------------------------------------------ */

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const s = await admin.get<DashboardStats>("dashboard/stats");
      setStats(s);
      setUpdatedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    admin
      .get<User>("auth/me")
      .then(setUser)
      .catch(() => undefined);
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, [load]);

  const series = stats?.viewsLast30Days ?? [];
  const last7 = series.slice(-7).reduce((a, b) => a + b.views, 0);
  const prev7 = series.slice(-14, -7).reduce((a, b) => a + b.views, 0);
  const maxRead = Math.max(1, ...(stats?.mostRead ?? []).map((a) => a.viewCount));

  const donutParts = useMemo(
    () =>
      stats
        ? [
            {
              label: "Published",
              value: stats.published,
              color: "#3f82dc",
              status: "PUBLISHED" as const,
            },
            { label: "Drafts", value: stats.drafts, color: "#f5c518", status: "DRAFT" as const },
            {
              label: "Scheduled",
              value: stats.scheduled,
              color: "#2658a6",
              status: "SCHEDULED" as const,
            },
            {
              label: "Archived",
              value: stats.archived,
              color: "#9fb3d9",
              status: "ARCHIVED" as const,
            },
          ]
        : [],
    [stats],
  );

  return (
    <div>
      <m.div className="flex flex-col gap-5" variants={container} initial="hidden" animate="show">
        {/* ---------- Hero ---------- */}
        <m.header
          variants={item}
          className="glass glass-dark relative overflow-hidden px-6 py-6 text-white md:px-8 md:py-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, #6ca6ee, transparent 65%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, #fbd84a, transparent 65%)" }}
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[0.62rem] tracking-[0.14em] text-white/80 uppercase">
                <Sparkles className="size-3.5 text-[#f5c518]" aria-hidden />
                Knowledge Hub · Overview
              </p>
              <h1 className="mt-4 text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] md:text-[2.1rem]">
                {greeting(now)}
                {user ? `, ${user.name.split(" ")[0]}` : ""}.
              </h1>
              <p className="mt-2 max-w-[52ch] text-sm text-white/70">
                {now.toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {stats && stats.unreadMessages > 0 && (
                  <>
                    {" · "}
                    <Link href="/admin/messages" className="text-[#ffe98a] hover:underline">
                      {stats.unreadMessages} unread{" "}
                      {stats.unreadMessages === 1 ? "message" : "messages"} waiting
                    </Link>
                  </>
                )}
                {stats && stats.unreadMessages === 0 && " · Inbox is clear"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/articles/new"
                className="text-ink-900 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold shadow-[0_10px_30px_-10px_rgba(255,255,255,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <PenSquare className="size-4" aria-hidden /> New article
              </Link>
              <Link
                href="/admin/messages"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <Inbox className="size-4" aria-hidden /> Inbox
              </Link>
              <Link
                href="/blog"
                target="_blank"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <ExternalLink className="size-4" aria-hidden /> View site
              </Link>
              <button
                type="button"
                onClick={load}
                disabled={loading}
                aria-label="Refresh"
                title={updatedAt ? `Updated ${timeAgo(updatedAt.toISOString())}` : "Refresh"}
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-60"
              >
                <RefreshCw className={cn("size-4", loading && "animate-spin")} aria-hidden />
              </button>
            </div>
          </div>
        </m.header>

        {error && (
          <m.div
            variants={item}
            className="glass flex items-center justify-between gap-4 border-red-200 bg-red-50/70 px-5 py-3 text-sm text-red-700"
            role="alert"
          >
            <span>{error}</span>
            <button type="button" onClick={load} className="font-medium underline">
              Retry
            </button>
          </m.div>
        )}

        {/* ---------- KPIs ---------- */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Kpi
            label="Articles"
            value={stats?.totalArticles}
            accent="blue"
            icon={Layers}
            href="/admin/articles"
            foot={
              <span className="text-ink-400">{stats ? `${stats.archived} archived` : "…"}</span>
            }
          />
          <Kpi
            label="Published"
            value={stats?.published}
            accent="emerald"
            icon={Send}
            href="/admin/articles?status=PUBLISHED"
            foot={
              <span className="text-ink-400">
                {stats ? `${pct(stats.published, stats.totalArticles)}% of library` : "…"}
              </span>
            }
          />
          <Kpi
            label="Drafts"
            value={stats?.drafts}
            accent="amber"
            icon={PenLine}
            href="/admin/articles?status=DRAFT"
            foot={<span className="text-ink-400">In progress</span>}
          />
          <Kpi
            label="Scheduled"
            value={stats?.scheduled}
            accent="violet"
            icon={CalendarClock}
            href="/admin/articles?status=SCHEDULED"
            foot={<span className="text-ink-400">Queued to publish</span>}
          />
          <Kpi
            label="Total views"
            value={stats?.totalViews}
            accent="cyan"
            icon={Eye}
            foot={
              stats ? <Delta now={last7} prev={prev7} /> : <span className="text-ink-400">…</span>
            }
          />
          <Kpi
            label="Unread messages"
            value={stats?.unreadMessages}
            accent="orange"
            icon={Inbox}
            href="/admin/messages"
            foot={
              <span
                className={stats && stats.unreadMessages > 0 ? accents.orange.text : "text-ink-400"}
              >
                {stats && stats.unreadMessages > 0 ? "Needs a reply" : "Inbox clear"}
              </span>
            }
          />
        </div>

        {/* ---------- Chart + donut ---------- */}
        <div className="grid gap-5 lg:grid-cols-3">
          <Panel
            title="Views · last 30 days"
            icon={Eye}
            className="lg:col-span-2"
            action={
              stats ? (
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-ink-500 whitespace-nowrap">
                    <span className="text-ink-900 font-semibold tabular-nums">{last7}</span> this
                    week
                  </span>
                  <span className="hidden sm:inline-flex">
                    <Delta now={last7} prev={prev7} />
                  </span>
                </div>
              ) : null
            }
          >
            {stats ? <ViewsChart data={series} /> : <Skeleton className="h-56" />}
          </Panel>
          <Panel title="Library status" icon={Layers}>
            {stats ? (
              <Donut parts={donutParts} total={stats.totalArticles} />
            ) : (
              <Skeleton className="h-36" />
            )}
          </Panel>
        </div>

        {/* ---------- Most read + messages ---------- */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel
            title="Most read"
            icon={Sparkles}
            padded={false}
            action={<PanelLink href="/admin/articles">All articles</PanelLink>}
          >
            {!stats ? (
              <div className="grid gap-3 p-5">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : stats.mostRead.length === 0 ? (
              <Empty text="No published articles yet." />
            ) : (
              <ol className="divide-y divide-white/70">
                {stats.mostRead.slice(0, 6).map((a, i) => (
                  <li key={a.id} className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg font-mono text-[0.68rem] font-semibold",
                          i === 0
                            ? "bg-gradient-to-br from-[#d9a90c] to-[#fbd84a] text-[#143070] shadow-[0_8px_20px_-8px_rgba(245,197,24,0.9)]"
                            : "bg-ink-900/6 text-ink-500",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/articles/${a.id}/edit`}
                          className="text-ink-900 hover:text-brand-600 block truncate text-sm font-medium"
                        >
                          {a.title}
                        </Link>
                        <p className="text-ink-400 text-xs">
                          {a.category?.name ?? "Uncategorised"} · {a.readingTimeMinutes} min read
                        </p>
                      </div>
                      <span className="text-ink-900 shrink-0 font-mono text-xs tabular-nums">
                        {a.viewCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-ink-900/6 mt-2 ml-10 h-1.5 overflow-hidden rounded-full">
                      <m.div
                        className={cn("h-full rounded-full bg-gradient-to-r", accents.blue.bar)}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(4, (a.viewCount / maxRead) * 100)}%` }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.05 }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          <Panel
            title="Latest messages"
            icon={Inbox}
            padded={false}
            action={<PanelLink href="/admin/messages">Open inbox</PanelLink>}
          >
            {!stats ? (
              <div className="grid gap-3 p-5">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : stats.recentMessages.length === 0 ? (
              <Empty text="No messages yet. Enquiries from the contact page will appear here." />
            ) : (
              <ul className="divide-y divide-white/70">
                {stats.recentMessages.slice(0, 6).map((msg) => (
                  <li key={msg.id}>
                    <Link
                      href="/admin/messages"
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50"
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-white",
                          msg.status === "NEW" ? accents.orange.chip : "from-ink-400 to-ink-300",
                        )}
                      >
                        {initials(msg.name) || "?"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-ink-900 truncate text-sm",
                            msg.status === "NEW" ? "font-semibold" : "font-medium",
                          )}
                        >
                          {msg.subject}
                        </p>
                        <p className="text-ink-400 truncate text-xs">
                          {msg.name}
                          {msg.organization ? ` · ${msg.organization}` : ""} — {msg.message}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.1em] uppercase",
                            messageTone[msg.status],
                          )}
                        >
                          {msg.status}
                        </span>
                        <span className="text-ink-400 font-mono text-[0.62rem]">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* ---------- Recent + activity ---------- */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel
            title="Recent articles"
            icon={FileText}
            padded={false}
            action={<PanelLink href="/admin/articles">All articles</PanelLink>}
          >
            {!stats ? (
              <div className="grid gap-3 p-5">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : stats.recent.length === 0 ? (
              <Empty text="Nothing written yet. Start with a new article." />
            ) : (
              <ul className="divide-y divide-white/70">
                {stats.recent.slice(0, 6).map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50"
                    >
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#3f82dc] to-[#6ca6ee]">
                        {a.coverImage?.url ? (
                          <Image
                            src={mediaUrl(a.coverImage.url)}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="grid size-full place-items-center text-sm font-semibold text-white">
                            {a.title[0]?.toUpperCase()}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-ink-900 truncate text-sm font-medium">{a.title}</p>
                        <p className="text-ink-400 text-xs">
                          {a.author?.name ?? "Unknown author"} · updated {timeAgo(a.updatedAt)}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Recent activity" icon={CalendarClock} padded={false}>
            {!stats ? (
              <div className="grid gap-3 p-5">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <Empty text="No activity yet." />
            ) : (
              <ol className="relative px-5 py-4">
                <span
                  aria-hidden
                  className="bg-ink-900/8 absolute top-6 bottom-6 left-[1.9rem] w-px"
                />
                {stats.recentActivity.slice(0, 8).map((e, i) => (
                  <li key={`${e.at}-${i}`} className="relative flex gap-4 py-2">
                    <span
                      className={cn(
                        "relative z-10 mt-1 size-3.5 shrink-0 rounded-full border-2 border-white",
                        i === 0
                          ? "bg-gradient-to-br from-[#3f82dc] to-[#a6ccf7] shadow-[0_0_0_4px_rgba(63,130,220,0.15)]"
                          : "bg-ink-300",
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="text-ink-900 text-sm leading-snug">
                        <span className="font-medium">{e.actor.split("@")[0]}</span>{" "}
                        <span className="text-ink-500">
                          {e.action.toLowerCase().replace(/_/g, " ")}
                        </span>{" "}
                        <Link
                          href={`/admin/articles/${e.articleId}/edit`}
                          className="hover:text-brand-600 font-medium"
                        >
                          {e.articleTitle}
                        </Link>
                      </p>
                      <p className="text-ink-400 mt-0.5 font-mono text-[0.62rem]">
                        {formatDateTime(e.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </m.div>
    </div>
  );
}
