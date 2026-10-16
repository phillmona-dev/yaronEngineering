"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Archive, Eye, Pencil, Plus, Search, Send, Star, Undo2 } from "lucide-react";
import { admin, qs } from "@/lib/admin/client";
import type { ArticleSummary, ArticleStatus, Category, Page } from "@/lib/blog/types";
import { formatDate, formatDateTime, mediaUrl, timeAgo } from "@/lib/blog/format";
import {
  Card,
  ConfirmDialog,
  CountChip,
  EmptyRow,
  PageHeader,
  Pagination,
  StatusBadge,
  TableSkeleton,
  inputCls,
  tableCls,
  tbodyCls,
  td,
  th,
  theadCls,
  trCls,
} from "./ui";
import { useToast } from "./Toast";

const STATUSES: (ArticleStatus | "")[] = ["", "DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];

export function ArticlesTable() {
  const toast = useToast();
  const [page, setPage] = useState<Page<ArticleSummary> | null>(null);
  const [filters, setFilters] = useState({
    q: "",
    status: "" as ArticleStatus | "",
    category: "",
    sort: "updated",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [confirm, setConfirm] = useState<{
    a: ArticleSummary;
    action: "publish" | "unpublish" | "archive" | "delete";
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    (p = 0) => {
      setPage(null);
      admin
        .get<Page<ArticleSummary>>(`articles${qs({ page: p, size: 20, ...filters })}`)
        .then(setPage)
        .catch((e) => toast("error", e.message));
    },
    [filters, toast],
  );
  useEffect(() => load(0), [load]);
  useEffect(() => {
    admin
      .get<Category[]>("categories")
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  async function run() {
    if (!confirm) return;
    setBusy(true);
    try {
      if (confirm.action === "delete") await admin.del(`articles/${confirm.a.id}`);
      else await admin.post(`articles/${confirm.a.id}/${confirm.action}`);
      toast(
        "success",
        `${confirm.action[0].toUpperCase()}${confirm.action.slice(1)}ed.`.replace("eed.", "ed."),
      );
      setConfirm(null);
      load(page?.page ?? 0);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Articles"
        description="Every article in the Knowledge Hub, in any state."
        actions={
          <Link
            href="/admin/articles/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#2f62c6] to-[#5b8be6] px-3.5 text-sm font-medium text-white shadow-[0_10px_24px_-10px_rgba(47,98,198,0.8)] transition-[box-shadow,transform] duration-300 hover:-translate-y-px hover:shadow-[0_14px_28px_-10px_rgba(47,98,198,0.9)]"
          >
            <Plus className="size-4" aria-hidden /> New article
          </Link>
        }
      />
      <Card padded={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-white/70 bg-white/25 p-3">
          <div className="relative w-full sm:w-60">
            <Search
              className="text-ink-400 pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search title…"
              aria-label="Search articles"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              className={`${inputCls} pl-8`}
            />
          </div>
          <div className="w-full sm:w-44">
            <select
              aria-label="Status"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value as ArticleStatus | "" }))
              }
              className={inputCls}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s || "All statuses"}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              aria-label="Category"
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              className={inputCls}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              aria-label="Sort"
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              className={inputCls}
            >
              <option value="updated">Recently updated</option>
              <option value="published">Recently published</option>
              <option value="views">Most viewed</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
          {page && (
            <span className="ml-auto">
              <CountChip>
                {page.totalElements} article{page.totalElements === 1 ? "" : "s"}
              </CountChip>
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className={`${tableCls} min-w-[900px] table-fixed`}>
            <colgroup>
              <col style={{ width: "31%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead className={theadCls}>
              <tr>
                <th className={th}>Title</th>
                <th className={th}>Status</th>
                <th className={th}>Category</th>
                <th className={th}>Author</th>
                <th className={th}>Dates</th>
                <th className={`${th} text-right`}>Views</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={tbodyCls}>
              {page === null ? (
                <TableSkeleton rows={8} cols={8} />
              ) : page.content.length === 0 ? (
                <EmptyRow colSpan={8} text="No articles match. Start by creating a new article." />
              ) : (
                page.content.map((a) => (
                  <tr key={a.id} className={trCls}>
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#2f62c6] to-[#7c3aed] shadow-[0_6px_14px_-6px_rgba(47,98,198,0.6)]">
                          {a.coverImage?.url ? (
                            <Image
                              src={mediaUrl(a.coverImage.url)}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized={a.coverImage.url.startsWith("http")}
                            />
                          ) : (
                            <span className="grid size-full place-items-center text-sm font-semibold text-white">
                              {(a.title || "U")[0].toUpperCase()}
                            </span>
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/articles/${a.id}/edit`}
                              className="hover:text-brand-600 truncate font-medium"
                              title={a.title || "Untitled"}
                            >
                              {a.title || "Untitled"}
                            </Link>
                            {a.featured && (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e9b917]/15 px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.1em] text-amber-800 uppercase ring-1 ring-[#e9b917]/30 ring-inset">
                                <Star className="size-2.5 fill-current" aria-hidden /> Featured
                              </span>
                            )}
                          </div>
                          <p className="text-ink-400 truncate font-mono text-[0.62rem]">
                            /blog/{a.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={td}>
                      <StatusBadge status={a.status} />
                      {a.status === "SCHEDULED" && a.scheduledAt && (
                        <p className="text-ink-400 mt-1 text-[0.68rem]">
                          {formatDateTime(a.scheduledAt)}
                        </p>
                      )}
                    </td>
                    <td className={`${td} text-ink-500`}>
                      <span className="block truncate" title={a.category?.name ?? ""}>
                        {a.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className={`${td} text-ink-500`}>
                      <span className="block truncate" title={a.author?.name ?? ""}>
                        {a.author?.name ?? "—"}
                      </span>
                    </td>
                    <td className={td}>
                      <p className="text-ink-900 truncate">
                        {a.publishedAt
                          ? formatDate(a.publishedAt, { month: "short" })
                          : "Not published"}
                      </p>
                      <p
                        className="text-ink-400 truncate text-xs"
                        title={formatDateTime(a.updatedAt)}
                      >
                        updated {timeAgo(a.updatedAt)}
                      </p>
                    </td>
                    <td className={`${td} text-right`}>
                      <span className="text-ink-900 inline-flex items-center gap-1.5 rounded-full bg-white/60 px-2 py-0.5 font-mono text-xs tabular-nums ring-1 ring-white/80 ring-inset">
                        <Eye className="text-ink-400 size-3" aria-hidden />
                        {a.viewCount.toLocaleString()}
                      </span>
                    </td>
                    <td className={`${td} text-right whitespace-nowrap`}>
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/articles/${a.id}/edit`}
                          aria-label="Edit"
                          className="text-ink-500 hover:text-ink-900 rounded-lg p-1.5 hover:bg-white/80"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <Link
                          href={`/admin/articles/${a.id}/preview`}
                          target="_blank"
                          aria-label="Preview"
                          className="text-ink-500 hover:text-ink-900 rounded-lg p-1.5 hover:bg-white/80"
                        >
                          <Eye className="size-3.5" />
                        </Link>
                        {a.status === "DRAFT" && (
                          <button
                            type="button"
                            onClick={() => setConfirm({ a, action: "publish" })}
                            aria-label="Publish"
                            title="Publish"
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-500/10"
                          >
                            <Send className="size-3.5" />
                          </button>
                        )}
                        {a.status === "PUBLISHED" && (
                          <button
                            type="button"
                            onClick={() => setConfirm({ a, action: "unpublish" })}
                            aria-label="Unpublish"
                            title="Unpublish (back to draft)"
                            className="text-ink-500 hover:text-ink-900 rounded-lg p-1.5 hover:bg-white/80"
                          >
                            <Undo2 className="size-3.5" />
                          </button>
                        )}
                        {a.status !== "ARCHIVED" && (
                          <button
                            type="button"
                            onClick={() => setConfirm({ a, action: "archive" })}
                            aria-label="Archive"
                            title="Archive"
                            className="text-ink-500 rounded-lg p-1.5 hover:bg-amber-500/10 hover:text-amber-700"
                          >
                            <Archive className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {page && (
          <Pagination
            page={page.page}
            totalPages={page.totalPages}
            last={page.last}
            onPage={load}
          />
        )}
      </Card>
      <ConfirmDialog
        open={confirm !== null}
        title={
          confirm
            ? `${confirm.action[0].toUpperCase()}${confirm.action.slice(1)} “${confirm.a.title}”?`
            : ""
        }
        text={
          confirm?.action === "publish"
            ? "The article will be visible on the public site immediately."
            : confirm?.action === "delete"
              ? "This cannot be undone."
              : confirm?.action === "unpublish"
                ? "It will return to draft and disappear from the site."
                : "Archived articles are hidden from the site and from this list by default."
        }
        confirmLabel={confirm ? confirm.action[0].toUpperCase() + confirm.action.slice(1) : ""}
        danger={confirm?.action === "delete"}
        loading={busy}
        onConfirm={run}
        onClose={() => setConfirm(null)}
      />
    </>
  );
}
