"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Copy, Trash2, Upload } from "lucide-react";
import { admin, qs } from "@/lib/admin/client";
import type { Media, Page } from "@/lib/blog/types";
import { mediaUrl } from "@/lib/blog/format";
import { AdminButton, Card, ConfirmDialog, Field, PageHeader, inputCls } from "./ui";
import { useToast } from "./Toast";

export function MediaUploader({ onUploaded }: { onUploaded: (m: Media) => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get("file") as File | null;
    const alt = String(form.get("altText") ?? "").trim();
    if (!file || !file.size) return toast("error", "Choose an image first.");
    if (!alt) return toast("error", "Alt text is required for accessibility.");
    setBusy(true);
    try {
      const media = await admin.upload<Media>("media", form);
      toast("success", "Image uploaded.");
      onUploaded(media);
      e.currentTarget.reset();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={upload} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <Field
        label="Image file"
        htmlFor="file"
        hint="JPEG, PNG, WebP or GIF · min 320×180 · up to 8 MB"
      >
        <input
          ref={fileRef}
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={inputCls}
        />
      </Field>
      <Field label="Alt text" htmlFor="altText" hint="Describe the image for screen readers.">
        <input id="altText" name="altText" type="text" className={inputCls} />
      </Field>
      <AdminButton type="submit" variant="primary" loading={busy} className="h-9">
        <Upload className="size-4" aria-hidden /> Upload
      </AdminButton>
    </form>
  );
}

export function MediaGrid({
  selectable,
  onSelect,
  refreshKey,
}: {
  selectable?: boolean;
  onSelect?: (m: Media) => void;
  refreshKey?: number;
}) {
  const toast = useToast();
  const [page, setPage] = useState<Page<Media> | null>(null);
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState<Media | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    (p = 0) => {
      admin
        .get<Page<Media>>(`media${qs({ page: p, size: 24, q })}`)
        .then(setPage)
        .catch((e) => toast("error", e.message));
    },
    [q, toast],
  );
  useEffect(() => load(0), [load, refreshKey]);

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await admin.del(`media/${deleting.id}`);
      toast("success", "Deleted.");
      setDeleting(null);
      load(page?.page ?? 0);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="search"
          placeholder="Filter by filename or alt text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={`${inputCls} max-w-xs`}
          aria-label="Filter media"
        />
        {page && (
          <span className="text-ink-400 text-xs">
            {page.totalElements} file{page.totalElements === 1 ? "" : "s"}
          </span>
        )}
      </div>
      {page === null ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-ink-100 aspect-[4/3] animate-pulse rounded-md" />
          ))}
        </div>
      ) : page.content.length === 0 ? (
        <p className="border-ink-200 text-ink-400 rounded-md border border-dashed p-10 text-center text-sm">
          No images yet. Upload the first cover image above.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {page.content.map((m) => (
            <li
              key={m.id}
              className="group border-ink-200 bg-ink-50 relative overflow-hidden rounded-md border"
            >
              <button
                type="button"
                onClick={() => selectable && onSelect?.(m)}
                className="block w-full text-left"
                disabled={!selectable}
                aria-label={selectable ? `Select ${m.altText}` : m.altText}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={mediaUrl(m.url)}
                    alt={m.altText}
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized={m.url.startsWith("http")}
                  />
                </div>
              </button>
              <div className="p-2">
                <p className="text-ink-900 truncate text-xs" title={m.altText}>
                  {m.altText}
                </p>
                <p className="text-ink-400 truncate font-mono text-[0.6rem]">
                  {m.width && m.height ? `${m.width}×${m.height} · ` : ""}
                  {m.mimeType.replace("image/", "")}
                </p>
              </div>
              {!selectable && (
                <div className="absolute top-1 right-1 hidden gap-1 group-hover:flex">
                  <button
                    type="button"
                    className="text-ink-600 hover:text-ink-900 rounded bg-white/90 p-1 shadow"
                    aria-label="Copy ID"
                    title="Copy media ID"
                    onClick={() =>
                      navigator.clipboard
                        ?.writeText(m.id)
                        .then(() => toast("info", "Media ID copied."))
                    }
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="rounded bg-white/90 p-1 text-red-600 shadow"
                    aria-label="Delete"
                    onClick={() => setDeleting(m)}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {page && page.totalPages > 1 && (
        <div className="text-ink-500 mt-4 flex items-center justify-between text-xs">
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
      <ConfirmDialog
        open={deleting !== null}
        title="Delete this image?"
        text="Images still used as a cover or inside an article cannot be deleted."
        confirmLabel="Delete"
        danger
        loading={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

export function MediaLibrary() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <PageHeader
        title="Media"
        description="Cover images and article images. Files are stored outside the database; only metadata is kept."
      />
      <Card title="Upload" className="mb-6">
        <MediaUploader onUploaded={() => setRefreshKey((k) => k + 1)} />
      </Card>
      <Card title="Library">
        <MediaGrid refreshKey={refreshKey} />
      </Card>
    </>
  );
}
