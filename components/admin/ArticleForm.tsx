"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Eye,
  Save,
  Send,
  Archive,
  Star,
  Undo2,
  Trash2,
  ImagePlus,
} from "lucide-react";
import { admin, AdminApiError } from "@/lib/admin/client";
import type {
  ArticleDetail,
  ArticleRequest,
  Author,
  Category,
  Media,
  Tag,
  User,
} from "@/lib/blog/types";
import { estimateReadingTime, formatDateTime, mediaUrl, slugify, timeAgo } from "@/lib/blog/format";
import {
  AdminButton,
  Card,
  ConfirmDialog,
  Field,
  Modal,
  StatusBadge,
  inputCls,
  labelCls,
} from "./ui";
import { useToast } from "./Toast";
import { MediaGrid, MediaUploader } from "./MediaLibrary";
import type { EditorValue } from "./editor/Editor";
import { cn } from "@/lib/utils/cn";

const Editor = dynamic(() => import("./editor/Editor").then((m) => m.Editor), {
  ssr: false,
  loading: () => <div className="bg-ink-100 h-[520px] animate-pulse rounded-lg" />,
});

type FormState = ArticleRequest & { coverImage: Media | null; ogImage: Media | null };

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://yaronengineering.com").replace(
  /\/$/,
  "",
);

function toForm(a: ArticleDetail | null): FormState {
  return {
    title: a?.title ?? "",
    slug: a?.slug ?? "",
    excerpt: a?.excerpt ?? "",
    contentHtml: a?.contentHtml ?? "",
    contentJson: a?.contentJson ?? null,
    coverImageId: a?.coverImage?.id ?? null,
    coverImage: a?.coverImage ?? null,
    categoryId: a?.category?.id ?? null,
    tagIds: a?.tags.map((t) => t.id) ?? [],
    authorId: a?.author?.id ?? null,
    featured: a?.featured ?? false,
    seoTitle: a?.seo.title ?? "",
    seoDescription: a?.seo.description ?? "",
    canonicalUrl: a?.seo.canonicalUrl ?? "",
    ogImageId: a?.seo.ogImage?.id ?? null,
    ogImage: a?.seo.ogImage ?? null,
    noIndex: a?.seo.noIndex ?? false,
  };
}

function toRequest(f: FormState): ArticleRequest {
  const { coverImage: _c, ogImage: _o, ...rest } = f;
  void _c;
  void _o;
  return {
    ...rest,
    slug: rest.slug || null,
    seoTitle: rest.seoTitle || null,
    seoDescription: rest.seoDescription || null,
    canonicalUrl: rest.canonicalUrl || null,
  };
}

export function ArticleForm({
  initial,
  user,
}: {
  initial: ArticleDetail | null;
  user: User | null;
}) {
  const router = useRouter();
  const toast = useToast();
  const [article, setArticle] = useState<ArticleDetail | null>(initial);
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(initial?.updatedAt ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState<{ categories: Category[]; tags: Tag[]; authors: Author[] }>({
    categories: [],
    tags: [],
    authors: [],
  });
  const [picker, setPicker] = useState<null | "cover" | "og" | "inline">(null);
  const [schedule, setSchedule] = useState<string>("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [confirm, setConfirm] = useState<null | "archive" | "delete" | "unpublish">(null);
  const pickResolver = useRef<((m: { src: string; alt: string } | null) => void) | null>(null);
  const [mediaRefresh, setMediaRefresh] = useState(0);
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    Promise.all([
      admin.get<Category[]>("categories"),
      admin.get<Tag[]>("tags"),
      admin.get<Author[]>("authors"),
    ])
      .then(([categories, tags, authors]) => {
        setMeta({ categories, tags, authors });
        if (!initial && authors.length === 1) setForm((f) => ({ ...f, authorId: authors[0].id }));
        if (!initial && user?.authorSlug) {
          const mine = authors.find((a) => a.slug === user.authorSlug);
          if (mine) setForm((f) => ({ ...f, authorId: mine.id }));
        }
      })
      .catch((e) => toast("error", e.message));
  }, [initial, toast, user?.authorSlug]);

  // Unsaved-changes guard
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const update = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  }, []);

  const onEditor = useCallback((v: EditorValue) => {
    setForm((f) => ({ ...f, contentHtml: v.html, contentJson: v.json }));
    setDirty(true);
  }, []);

  const save = useCallback(
    async (silent = false): Promise<ArticleDetail | null> => {
      const f = formRef.current;
      if (!f.title.trim()) {
        if (!silent) toast("error", "Give the article a title first.");
        return null;
      }
      setSaving(true);
      setErrors({});
      try {
        const body = toRequest(f);
        const saved = article
          ? await admin.put<ArticleDetail>(`articles/${article.id}`, body)
          : await admin.post<ArticleDetail>("articles", body);
        setArticle(saved);
        setForm((cur) => ({ ...cur, slug: saved.slug }));
        setSavedAt(new Date().toISOString());
        setDirty(false);
        if (!article) router.replace(`/admin/articles/${saved.id}/edit`);
        if (!silent) toast("success", "Draft saved.");
        return saved;
      } catch (err) {
        if (err instanceof AdminApiError && err.errors?.length)
          setErrors(Object.fromEntries(err.errors.map((x) => [x.field, x.message])));
        if (!silent) toast("error", err instanceof Error ? err.message : "Save failed");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [article, router, toast],
  );

  // Autosave every 45 s while dirty
  useEffect(() => {
    if (!dirty) return;
    const t = setInterval(() => {
      if (formRef.current.title.trim()) save(true);
    }, 45000);
    return () => clearInterval(t);
  }, [dirty, save]);

  async function act(
    action: "publish" | "unpublish" | "archive" | "unarchive" | "schedule" | "delete" | "feature",
  ) {
    setActing(action);
    try {
      let current = article;
      if (dirty || !current) current = await save(true);
      if (!current) return;
      if (action === "delete") {
        await admin.del(`articles/${current.id}`);
        toast("success", "Article deleted.");
        router.replace("/admin/articles");
        return;
      }
      let updated: ArticleDetail;
      if (action === "schedule")
        updated = await admin.post<ArticleDetail>(`articles/${current.id}/schedule`, {
          scheduledAt: new Date(schedule).toISOString(),
        });
      else if (action === "feature")
        updated = await admin.post<ArticleDetail>(`articles/${current.id}/feature`, {
          featured: !current.featured,
        });
      else updated = await admin.post<ArticleDetail>(`articles/${current.id}/${action}`);
      setArticle(updated);
      setForm((f) => ({ ...f, featured: updated.featured }));
      setErrors({});
      toast(
        "success",
        {
          publish: "Published. The site will update within moments.",
          unpublish: "Unpublished — back to draft.",
          archive: "Archived.",
          unarchive: "Restored to draft.",
          schedule: `Scheduled for ${formatDateTime(updated.scheduledAt)}.`,
          feature: updated.featured ? "Marked as featured." : "Removed from featured.",
        }[action],
      );
      setScheduleOpen(false);
      setConfirm(null);
    } catch (err) {
      if (err instanceof AdminApiError && err.errors?.length) {
        setErrors(Object.fromEntries(err.errors.map((x) => [x.field, x.message])));
        toast("error", `Cannot ${action}: ${err.errors.map((x) => x.field).join(", ")} required.`);
      } else toast("error", err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  const pickImage = useCallback(
    () =>
      new Promise<{ src: string; alt: string } | null>((resolve) => {
        pickResolver.current = resolve;
        setPicker("inline");
      }),
    [],
  );
  function onPicked(m: Media) {
    if (picker === "cover") {
      update("coverImageId", m.id);
      update("coverImage", m);
    } else if (picker === "og") {
      update("ogImageId", m.id);
      update("ogImage", m);
    } else pickResolver.current?.({ src: mediaUrl(m.url), alt: m.altText });
    setPicker(null);
  }
  function closePicker() {
    pickResolver.current?.(null);
    setPicker(null);
  }

  const canPublish = user?.role === "ADMIN" || user?.role === "EDITOR";
  const status = article?.status ?? "DRAFT";
  const readMins = useMemo(() => estimateReadingTime(form.contentHtml), [form.contentHtml]);
  const seoTitle = form.seoTitle || form.title || "Article title";
  const seoDesc = form.seoDescription || form.excerpt || "Meta description preview.";
  const previewSlug = form.slug || slugify(form.title) || "article-slug";
  const checklist = [
    ["Title", Boolean(form.title.trim())],
    ["Excerpt", Boolean(form.excerpt.trim())],
    ["Content", form.contentHtml.replace(/<[^>]+>/g, "").trim().length > 0],
    ["Category", Boolean(form.categoryId)],
    ["Author", Boolean(form.authorId)],
    ["Cover image", Boolean(form.coverImageId)],
    ["SEO description", Boolean(form.seoDescription?.trim())],
  ] as const;
  const ready = checklist.every(([, ok]) => ok);

  return (
    <>
      {/* Top bar */}
      <div className="border-ink-200 bg-ink-50/95 sticky top-14 z-30 -mx-4 mb-6 border-b px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:top-0 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles" className="text-ink-500 hover:text-ink-900 text-sm">
              ← Articles
            </Link>
            <StatusBadge status={status} />
            {article?.featured && (
              <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] tracking-[0.1em] text-amber-700 uppercase">
                <Star className="size-3" /> Featured
              </span>
            )}
            <span className="text-ink-400 text-xs">
              {saving
                ? "Saving…"
                : dirty
                  ? "Unsaved changes"
                  : savedAt
                    ? `Saved ${timeAgo(savedAt)}`
                    : "Not saved yet"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton onClick={() => save()} loading={saving}>
              <Save className="size-4" aria-hidden /> Save draft
            </AdminButton>
            <AdminButton
              onClick={async () => {
                const s = dirty || !article ? await save(true) : article;
                if (s) window.open(`/admin/articles/${s.id}/preview`, "_blank");
              }}
            >
              <Eye className="size-4" aria-hidden /> Preview
            </AdminButton>
            {canPublish && status !== "PUBLISHED" && status !== "ARCHIVED" && (
              <>
                <AdminButton onClick={() => setScheduleOpen(true)}>
                  <CalendarClock className="size-4" aria-hidden /> Schedule
                </AdminButton>
                <AdminButton
                  variant="primary"
                  onClick={() => act("publish")}
                  loading={acting === "publish"}
                  title={ready ? "Publish now" : "Complete the checklist to publish"}
                >
                  <Send className="size-4" aria-hidden /> Publish
                </AdminButton>
              </>
            )}
            {canPublish && status === "PUBLISHED" && (
              <>
                <AdminButton variant="primary" onClick={() => save()} loading={saving}>
                  Update live article
                </AdminButton>
                <AdminButton onClick={() => setConfirm("unpublish")}>
                  <Undo2 className="size-4" aria-hidden /> Unpublish
                </AdminButton>
              </>
            )}
            {canPublish && status === "ARCHIVED" && (
              <AdminButton onClick={() => act("unarchive")} loading={acting === "unarchive"}>
                Restore to draft
              </AdminButton>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              onBlur={() => {
                if (!form.slug && !article) update("slug", slugify(form.title));
              }}
              placeholder="Article title"
              aria-invalid={Boolean(errors.title)}
              className="text-ink-900 placeholder:text-ink-300 w-full border-0 bg-transparent text-3xl font-semibold tracking-[-0.02em] focus:outline-none md:text-4xl"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>
          <Field
            label="Excerpt"
            htmlFor="excerpt"
            hint={`${form.excerpt.length}/300 · Shown in lists and as the default meta description.`}
            error={errors.excerpt}
          >
            <textarea
              id="excerpt"
              rows={3}
              maxLength={300}
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              className={inputCls}
              aria-invalid={Boolean(errors.excerpt)}
            />
          </Field>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className={labelCls}>Content</span>
              <span className="text-ink-400 text-xs">≈ {readMins} min read</span>
            </div>
            <Editor
              initialHtml={initial?.contentHtml ?? ""}
              onChange={onEditor}
              onPickImage={pickImage}
            />
            {errors.contentHtml && (
              <p className="mt-1 text-xs text-red-600">{errors.contentHtml}</p>
            )}
          </div>

          <Card title="SEO">
            <div className="grid gap-4">
              <Field
                label="SEO title"
                htmlFor="seoTitle"
                hint={`${(form.seoTitle ?? "").length}/60 · Defaults to the article title.`}
              >
                <input
                  id="seoTitle"
                  maxLength={70}
                  value={form.seoTitle ?? ""}
                  onChange={(e) => update("seoTitle", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field
                label="Meta description"
                htmlFor="seoDescription"
                hint={`${(form.seoDescription ?? "").length}/160 · Required to publish.`}
                error={errors.seoDescription}
              >
                <textarea
                  id="seoDescription"
                  rows={2}
                  maxLength={170}
                  value={form.seoDescription ?? ""}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  className={inputCls}
                  aria-invalid={Boolean(errors.seoDescription)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="URL slug"
                  htmlFor="slug"
                  hint="Changes the public URL. Keep stable once published."
                  error={errors.slug}
                >
                  <input
                    id="slug"
                    value={form.slug ?? ""}
                    onChange={(e) => update("slug", slugify(e.target.value) || e.target.value)}
                    className={cn(inputCls, "font-mono text-xs")}
                    aria-invalid={Boolean(errors.slug)}
                  />
                </Field>
                <Field
                  label="Canonical URL"
                  htmlFor="canonicalUrl"
                  hint="Only when this article was first published elsewhere."
                >
                  <input
                    id="canonicalUrl"
                    type="url"
                    value={form.canonicalUrl ?? ""}
                    onChange={(e) => update("canonicalUrl", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="border-ink-200 bg-ink-50 rounded-md border p-4">
                <p className="text-ink-400 font-mono text-[0.6rem] tracking-[0.12em] uppercase">
                  Search preview
                </p>
                <p className="text-ink-500 mt-2 text-xs">Yaron Engineering PLC</p>
                <p className="truncate text-base font-medium text-[#1a0dab]">
                  {seoTitle.length > 60 ? `${seoTitle.slice(0, 57)}…` : seoTitle}
                </p>
                <p className="truncate font-mono text-xs text-emerald-700">
                  {SITE}/blog/{previewSlug}
                </p>
                <p className="text-ink-600 mt-1 line-clamp-2 text-sm">{seoDesc}</p>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.noIndex}
                    onChange={(e) => update("noIndex", e.target.checked)}
                  />{" "}
                  Hide from search engines (noindex)
                </label>
                <div className="flex items-center gap-3 text-sm">
                  <span>Social image:</span>
                  {form.ogImage ? (
                    <span className="text-ink-500 truncate text-xs">{form.ogImage.altText}</span>
                  ) : (
                    <span className="text-ink-400 text-xs">cover image</span>
                  )}
                  <AdminButton size="sm" onClick={() => setPicker("og")}>
                    Choose
                  </AdminButton>
                  {form.ogImage && (
                    <AdminButton
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        update("ogImageId", null);
                        update("ogImage", null);
                      }}
                    >
                      Clear
                    </AdminButton>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card title="Publishing">
            <ul className="flex flex-col gap-1.5 text-sm">
              {checklist.map(([label, ok]) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={cn("size-1.5 rounded-full", ok ? "bg-emerald-500" : "bg-ink-300")}
                    aria-hidden
                  />
                  {label}
                  <span className="sr-only">{ok ? " complete" : " missing"}</span>
                </li>
              ))}
            </ul>
            {article?.scheduledAt && status === "SCHEDULED" && (
              <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Goes live {formatDateTime(article.scheduledAt)}.
              </p>
            )}
            {article?.publishedAt && (
              <p className="text-ink-400 mt-3 text-xs">
                First published {formatDateTime(article.publishedAt)}
              </p>
            )}
            {canPublish && article && (
              <div className="border-ink-100 mt-4 flex flex-wrap gap-2 border-t pt-4">
                <AdminButton
                  size="sm"
                  onClick={() => act("feature")}
                  loading={acting === "feature"}
                >
                  <Star className="size-3.5" aria-hidden />{" "}
                  {article.featured ? "Unfeature" : "Feature"}
                </AdminButton>
                {status !== "ARCHIVED" && (
                  <AdminButton size="sm" onClick={() => setConfirm("archive")}>
                    <Archive className="size-3.5" aria-hidden /> Archive
                  </AdminButton>
                )}
                {user?.role === "ADMIN" && (
                  <AdminButton size="sm" variant="danger" onClick={() => setConfirm("delete")}>
                    <Trash2 className="size-3.5" aria-hidden /> Delete
                  </AdminButton>
                )}
              </div>
            )}
          </Card>

          <Card title="Cover image">
            {form.coverImage ? (
              <div>
                <div className="border-ink-200 relative aspect-[16/10] overflow-hidden rounded-md border">
                  <Image
                    src={mediaUrl(form.coverImage.url)}
                    alt={form.coverImage.altText}
                    fill
                    sizes="340px"
                    className="object-cover"
                    unoptimized={form.coverImage.url.startsWith("http")}
                  />
                </div>
                <p className="text-ink-500 mt-2 truncate text-xs">{form.coverImage.altText}</p>
                <div className="mt-2 flex gap-2">
                  <AdminButton size="sm" onClick={() => setPicker("cover")}>
                    Replace
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      update("coverImageId", null);
                      update("coverImage", null);
                    }}
                  >
                    Remove
                  </AdminButton>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPicker("cover")}
                className={cn(
                  "text-ink-500 hover:border-brand-500 hover:text-brand-600 flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm",
                  errors.coverImageId ? "border-red-400" : "border-ink-300",
                )}
              >
                <ImagePlus className="size-5" aria-hidden /> Choose cover image
              </button>
            )}
          </Card>

          <Card title="Organisation">
            <div className="grid gap-4">
              <Field label="Category" htmlFor="categoryId" error={errors.categoryId}>
                <select
                  id="categoryId"
                  value={form.categoryId ?? ""}
                  onChange={(e) => update("categoryId", e.target.value || null)}
                  className={inputCls}
                  aria-invalid={Boolean(errors.categoryId)}
                >
                  <option value="">Select a category</option>
                  {meta.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Author" htmlFor="authorId" error={errors.authorId}>
                <select
                  id="authorId"
                  value={form.authorId ?? ""}
                  onChange={(e) => update("authorId", e.target.value || null)}
                  className={inputCls}
                  aria-invalid={Boolean(errors.authorId)}
                >
                  <option value="">Select an author</option>
                  {meta.authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                      {a.position ? ` · ${a.position}` : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <div>
                <span className={labelCls}>Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {meta.tags.map((t) => {
                    const on = form.tagIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          update(
                            "tagIds",
                            on ? form.tagIds.filter((x) => x !== t.id) : [...form.tagIds, t.id],
                          )
                        }
                        className={cn(
                          "rounded-sm border px-2 py-1 text-xs transition-colors",
                          on
                            ? "border-ink-900 bg-ink-900 text-white"
                            : "border-ink-200 text-ink-600 hover:border-ink-400",
                        )}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                  {meta.tags.length === 0 && (
                    <Link href="/admin/tags" className="text-brand-600 text-xs">
                      Create tags
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={picker !== null}
        title={
          picker === "inline"
            ? "Insert image"
            : picker === "og"
              ? "Choose social image"
              : "Choose cover image"
        }
        onClose={closePicker}
        wide
      >
        <div className="border-ink-200 bg-ink-50 mb-5 rounded-md border p-4">
          <MediaUploader
            onUploaded={(m) => {
              setMediaRefresh((k) => k + 1);
              onPicked(m);
            }}
          />
        </div>
        <MediaGrid selectable onSelect={onPicked} refreshKey={mediaRefresh} />
      </Modal>

      <Modal
        open={scheduleOpen}
        title="Schedule publication"
        onClose={() => setScheduleOpen(false)}
      >
        <p className="text-ink-500 text-sm">
          The article goes live automatically at this time (your local timezone). The publishing
          checklist must be complete.
        </p>
        <Field label="Publish at" htmlFor="scheduledAt" className="mt-4">
          <input
            id="scheduledAt"
            type="datetime-local"
            value={schedule}
            min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
            onChange={(e) => setSchedule(e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton onClick={() => setScheduleOpen(false)}>Cancel</AdminButton>
          <AdminButton
            variant="primary"
            disabled={!schedule}
            loading={acting === "schedule"}
            onClick={() => act("schedule")}
          >
            Schedule
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirm === "unpublish"}
        title="Unpublish this article?"
        text="It will disappear from the public site immediately and return to draft."
        confirmLabel="Unpublish"
        loading={acting === "unpublish"}
        onConfirm={() => act("unpublish")}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "archive"}
        title="Archive this article?"
        text="Archived articles are hidden from the site and from the default article list. You can restore them later."
        confirmLabel="Archive"
        loading={acting === "archive"}
        onConfirm={() => act("archive")}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        title="Delete this article permanently?"
        text="This removes the article and all its revisions. Consider archiving instead."
        confirmLabel="Delete"
        danger
        loading={acting === "delete"}
        onConfirm={() => act("delete")}
        onClose={() => setConfirm(null)}
      />
    </>
  );
}
