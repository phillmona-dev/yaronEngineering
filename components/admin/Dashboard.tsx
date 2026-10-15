"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { admin } from "@/lib/admin/client";
import type { DashboardStats } from "@/lib/blog/types";
import { Card, PageHeader, StatusBadge } from "./ui";
import { formatDateTime, timeAgo } from "@/lib/blog/format";
import { cn } from "@/lib/utils/cn";

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="border-ink-200 rounded-lg border bg-white p-5">
      <p className="text-ink-400 font-mono text-[0.62rem] tracking-[0.12em] uppercase">{label}</p>
      <p className="text-ink-900 mt-2 text-3xl font-semibold tracking-[-0.02em] tabular-nums">
        {value}
      </p>
      {hint && <p className="text-ink-400 mt-1 text-xs">{hint}</p>}
    </div>
  );
}

function ViewsChart({ data }: { data: { date: string; views: number }[] }) {
  if (!data.length) return <p className="text-ink-400 text-sm">No view data yet.</p>;
  const max = Math.max(1, ...data.map((d) => d.views));
  const w = 600,
    h = 140,
    pad = 4;
  const step = (w - pad * 2) / Math.max(1, data.length - 1);
  const pts = data.map(
    (d, i) => [pad + i * step, h - pad - (d.views / max) * (h - pad * 2)] as const,
  );
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0].toFixed(1)},${h - pad} L${pad},${h - pad} Z`;
  return (
    <figure>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-36 w-full"
        role="img"
        aria-label={`Article views over the last ${data.length} days, peaking at ${max}`}
      >
        <defs>
          <linearGradient id="views-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2f62c6" stopOpacity="0.25" />
            <stop offset="1" stopColor="#2f62c6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#views-fill)" />
        <path d={path} fill="none" stroke="#2f62c6" strokeWidth="1.5" />
      </svg>
      <figcaption className="text-ink-400 mt-2 flex justify-between font-mono text-[0.6rem] tracking-[0.1em] uppercase">
        <span>{data[0].date}</span>
        <span>Peak {max}</span>
        <span>{data[data.length - 1].date}</span>
      </figcaption>
    </figure>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    admin
      .get<DashboardStats>("dashboard/stats")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" description="Publishing overview for the Knowledge Hub." />
      {error && (
        <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatTile label="Articles" value={stats?.totalArticles ?? "–"} />
        <StatTile label="Published" value={stats?.published ?? "–"} />
        <StatTile label="Drafts" value={stats?.drafts ?? "–"} />
        <StatTile label="Scheduled" value={stats?.scheduled ?? "–"} />
        <StatTile
          label="Total views"
          value={stats ? stats.totalViews.toLocaleString() : "–"}
          hint="Deduplicated per reader per day"
        />
        <Link
          href="/admin/messages"
          className="border-ink-200 hover:border-brand-500 rounded-lg border bg-white p-5 transition-colors"
        >
          <p className="text-ink-400 font-mono text-[0.62rem] tracking-[0.12em] uppercase">
            Unread messages
          </p>
          <p
            className={cn(
              "mt-2 text-3xl font-semibold tracking-[-0.02em] tabular-nums",
              stats && stats.unreadMessages > 0 ? "text-brand-600" : "text-ink-900",
            )}
          >
            {stats?.unreadMessages ?? "–"}
          </p>
          <p className="text-ink-400 mt-1 text-xs">From the contact form</p>
        </Link>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Views · last 30 days" className="lg:col-span-2">
          {stats ? (
            <ViewsChart data={stats.viewsLast30Days} />
          ) : (
            <div className="bg-ink-100 h-36 animate-pulse rounded" />
          )}
        </Card>
        <Card title="Most read">
          <ol className="divide-ink-100 flex flex-col divide-y">
            {(stats?.mostRead ?? []).slice(0, 6).map((a, i) => (
              <li key={a.id} className="flex items-start gap-3 py-2.5 text-sm">
                <span className="text-ink-400 font-mono text-[0.62rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/admin/articles/${a.id}/edit`}
                  className="hover:text-brand-600 flex-1 leading-snug"
                >
                  {a.title}
                </Link>
                <span className="text-ink-400 font-mono text-xs tabular-nums">
                  {a.viewCount.toLocaleString()}
                </span>
              </li>
            ))}
            {stats && stats.mostRead.length === 0 && (
              <li className="text-ink-400 py-4 text-sm">No published articles yet.</li>
            )}
          </ol>
        </Card>
      </div>
      <Card
        title="Latest messages"
        className="mt-6"
        action={
          <Link href="/admin/messages" className="text-brand-600 text-xs font-medium">
            Open inbox
          </Link>
        }
        padded={false}
      >
        <ul className="divide-ink-100 divide-y">
          {(stats?.recentMessages ?? []).map((m) => (
            <li key={m.id} className="flex items-center gap-4 px-5 py-3 text-sm">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  m.status === "NEW" ? "bg-brand-500" : "bg-ink-200",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className={cn("truncate", m.status === "NEW" ? "font-semibold" : "font-medium")}>
                  {m.subject}{" "}
                  <span className="text-ink-500 font-normal">
                    · {m.name}
                    {m.organization ? `, ${m.organization}` : ""}
                  </span>
                </p>
                <p className="text-ink-400 truncate text-xs">{m.message}</p>
              </div>
              <span className="text-ink-400 shrink-0 font-mono text-[0.62rem]">
                {timeAgo(m.createdAt)}
              </span>
            </li>
          ))}
          {stats && stats.recentMessages.length === 0 && (
            <li className="text-ink-400 px-5 py-4 text-sm">
              No messages yet. Enquiries from the contact page will appear here.
            </li>
          )}
        </ul>
      </Card>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent articles"
          action={
            <Link href="/admin/articles" className="text-brand-600 text-xs font-medium">
              All articles
            </Link>
          }
          padded={false}
        >
          <ul className="divide-ink-100 divide-y">
            {(stats?.recent ?? []).slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="hover:text-brand-600 block truncate font-medium"
                  >
                    {a.title}
                  </Link>
                  <p className="text-ink-400 text-xs">
                    {a.author?.name} · updated {timeAgo(a.updatedAt)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Recent activity" padded={false}>
          <ul className="divide-ink-100 divide-y">
            {(stats?.recentActivity ?? []).slice(0, 8).map((e, i) => (
              <li key={i} className="px-5 py-3 text-sm">
                <p>
                  <span className="font-medium">{e.actor}</span>{" "}
                  <span className="text-ink-500">{e.action.toLowerCase().replace(/_/g, " ")}</span>{" "}
                  <Link
                    href={`/admin/articles/${e.articleId}/edit`}
                    className="hover:text-brand-600"
                  >
                    {e.articleTitle}
                  </Link>
                </p>
                <p className="text-ink-400 text-xs">{formatDateTime(e.at)}</p>
              </li>
            ))}
            {stats && stats.recentActivity.length === 0 && (
              <li className="text-ink-400 px-5 py-4 text-sm">No activity yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </>
  );
}
