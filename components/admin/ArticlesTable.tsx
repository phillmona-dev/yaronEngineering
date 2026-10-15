"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import { admin, qs } from "@/lib/admin/client";
import type { ArticleSummary, ArticleStatus, Category, Page } from "@/lib/blog/types";
import { formatDateTime, timeAgo } from "@/lib/blog/format";
import {
  AdminButton,
  Card,
  ConfirmDialog,
  EmptyRow,
  PageHeader,
  StatusBadge,
  TableSkeleton,
  inputCls,
  td,
  th,
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
            className="bg-brand-500 hover:bg-brand-600 inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium text-white"
          >
            <Plus className="size-4" aria-hidden /> New article
          </Link>
        }
      />
      <Card padded={false}>
        <div className="border-ink-100 flex flex-wrap items-center gap-2 border-b p-3">
          <div className="relative">
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
              className={`${inputCls} w-56 pl-8`}
            />
          </div>
          <select
            aria-label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value as ArticleStatus | "" }))
            }
            className={`${inputCls} w-auto`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s || "All statuses"}
              </option>
            ))}
          </select>
          <select
            aria-label="Category"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            className={`${inputCls} w-auto`}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort"
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className={`${inputCls} w-auto`}
          >
            <option value="updated">Recently updated</option>
            <option value="published">Recently published</option>
            <option value="views">Most viewed</option>
            <option value="title">Title A–Z</option>
          </select>
          {page && (
            <span className="text-ink-400 ml-auto text-xs">
              {page.totalElements} article{page.totalElements === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-ink-100 border-b">
              <tr>
                <th className={th}>Title</th>
                <th className={th}>Status</th>
                <th className={th}>Category</th>
                <th className={th}>Author</th>
                <th className={th}>Published</th>
                <th className={th}>Updated</th>
                <th className={`${th} text-right`}>Views</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody className="divide-ink-100 divide-y">
              {page === null ? (
                <TableSkeleton rows={8} cols={8} />
              ) : page.content.length === 0 ? (
                <EmptyRow colSpan={8} text="No articles match. Start by creating a new article." />
              ) : (
                page.content.map((a) => (
                  <tr key={a.id} className="hover:bg-ink-50/60">
                    <td className={td}>
                      <Link
                        href={`/admin/articles/${a.id}/edit`}
                        className="hover:text-brand-600 font-medium"
                      >
                        {a.title || "Untitled"}
                      </Link>
                      {a.featured && (
                        <span className="ml-2 font-mono text-[0.58rem] tracking-[0.1em] text-amber-700 uppercase">
                          Featured
                        </span>
                      )}
                      <p className="text-ink-400 font-mono text-[0.62rem]">/blog/{a.slug}</p>
                    </td>
                    <td className={td}>
                      <StatusBadge status={a.status} />
                      {a.status === "SCHEDULED" && a.scheduledAt && (
                        <p className="text-ink-400 mt-1 text-[0.68rem]">
                          {formatDateTime(a.scheduledAt)}
                        </p>
                      )}
                    </td>
                    <td className={`${td} text-ink-500`}>{a.category?.name ?? "—"}</td>
                    <td className={`${td} text-ink-500`}>{a.author?.name ?? "—"}</td>
                    <td className={`${td} text-ink-500`}>
                      {a.publishedAt ? formatDateTime(a.publishedAt) : "—"}
                    </td>
                    <td className={`${td} text-ink-500`} title={formatDateTime(a.updatedAt)}>
                      {timeAgo(a.updatedAt)}
                    </td>
                    <td className={`${td} text-right tabular-nums`}>
                      {a.viewCount.toLocaleString()}
                    </td>
                    <td className={`${td} text-right`}>
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/articles/${a.id}/edit`}
                          aria-label="Edit"
                          className="text-ink-500 hover:bg-ink-100 hover:text-ink-900 rounded-md p-1.5"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <Link
                          href={`/admin/articles/${a.id}/preview`}
                          target="_blank"
                          aria-label="Preview"
                          className="text-ink-500 hover:bg-ink-100 hover:text-ink-900 rounded-md p-1.5"
                        >
                          <Eye className="size-3.5" />
                        </Link>
                        {a.status === "DRAFT" && (
                          <AdminButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirm({ a, action: "publish" })}
                          >
                            Publish
                          </AdminButton>
                        )}
                        {a.status === "PUBLISHED" && (
                          <AdminButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirm({ a, action: "unpublish" })}
                          >
                            Unpublish
                          </AdminButton>
                        )}
                        {a.status !== "ARCHIVED" && (
                          <AdminButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirm({ a, action: "archive" })}
                          >
                            Archive
                          </AdminButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {page && page.totalPages > 1 && (
          <div className="border-ink-100 text-ink-500 flex items-center justify-between border-t p-3 text-xs">
            <AdminButton size="sm" disabled={page.page === 0} onClick={() => load(page.page - 1)}>
              Previous
            </AdminButton>
            <span>
              Page {page.page + 1} of {page.totalPages}
            </span>
            <AdminButton size="sm" disabled={page.last} onClick={() => load(page.page + 1)}>
              Next
            </AdminButton>
          </div>
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
