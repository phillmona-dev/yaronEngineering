"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RotateCcw, Save } from "lucide-react";
import { admin } from "@/lib/admin/client";
import type { SiteContentDoc } from "@/lib/blog/types";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { mergeSection } from "@/lib/content/merge";
import { getSection } from "@/lib/content/schema";
import { setAt, validate, type Path } from "@/lib/content/form";
import { AdminButton, Card, ConfirmDialog, PageHeader } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";
import { FieldList } from "./Fields";

/**
 * Edits one website section. Loads the stored document (if any) merged over the built-in
 * defaults, so the owner always sees the complete, current content and can change any part.
 */
export function ContentEditor({ sectionId }: { sectionId: string }) {
  const toast = useToast();
  const spec = getSection(sectionId);
  const [doc, setDoc] = useState<SiteContentDoc | null | undefined>(undefined);
  const [value, setValue] = useState<Record<string, unknown> | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  const defaults = spec ? (DEFAULT_CONTENT[spec.id] as Record<string, unknown>) : null;

  const load = useCallback(async () => {
    if (!spec || !defaults) return;
    try {
      const stored = await admin.get<SiteContentDoc>(`site-content/${spec.id}`);
      const merged = mergeSection(defaults, stored.data) as Record<string, unknown>;
      setDoc(stored);
      setValue(merged);
      setSaved(JSON.stringify(merged));
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 404) {
        setDoc(null);
        setValue(defaults);
        setSaved(JSON.stringify(defaults));
      } else toast("error", err instanceof Error ? err.message : "Could not load content");
    }
  }, [spec, defaults, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = useMemo(() => value !== null && JSON.stringify(value) !== saved, [value, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = useCallback((path: Path, v: unknown) => {
    setValue((cur) => (cur ? setAt(cur, path, v) : cur));
  }, []);

  if (!spec || !defaults) {
    return (
      <Card>
        <p className="text-ink-500 text-sm">This content section does not exist.</p>
        <Link href="/admin/content" className="text-brand-700 mt-3 inline-block text-sm">
          Back to website content
        </Link>
      </Card>
    );
  }

  async function save() {
    if (!value) return;
    const found = validate(spec!.fields, value);
    setProblems(found);
    if (found.length) {
      toast(
        "error",
        `Please fill in ${found.length === 1 ? "the missing field" : `${found.length} missing fields`}.`,
      );
      return;
    }
    setSaving(true);
    try {
      const stored = await admin.put<SiteContentDoc>(`site-content/${spec!.id}`, value);
      setDoc(stored);
      setSaved(JSON.stringify(value));
      toast("success", "Saved. The website now shows the new content.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setResetting(true);
    try {
      await admin.del(`site-content/${spec!.id}`);
      setDoc(null);
      setValue(defaults);
      setSaved(JSON.stringify(defaults));
      setProblems([]);
      toast("success", "Restored the built-in content for this section.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Reset failed");
    } finally {
      setResetting(false);
      setConfirmReset(false);
    }
  }

  const Icon = spec.icon;

  return (
    <>
      <Link
        href="/admin/content"
        className="text-ink-500 hover:text-ink-900 mb-4 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden /> All website content
      </Link>
      <PageHeader
        title={spec.title}
        description={spec.description}
        actions={
          <>
            <a
              href={spec.previewPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-500 hover:text-ink-900 inline-flex h-9 items-center gap-1.5 px-2 text-sm"
            >
              <ExternalLink className="size-4" aria-hidden /> View page
            </a>
            <AdminButton
              type="button"
              variant="ghost"
              onClick={() => setConfirmReset(true)}
              disabled={doc === null || doc === undefined}
              title={
                doc
                  ? "Discard your changes and go back to the built-in content"
                  : "Already using the built-in content"
              }
            >
              <RotateCcw className="size-4" aria-hidden /> Restore built-in
            </AdminButton>
            <AdminButton
              type="button"
              variant="primary"
              onClick={save}
              loading={saving}
              disabled={!dirty}
            >
              <Save className="size-4" aria-hidden /> Save changes
            </AdminButton>
          </>
        }
      />

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="glass flex items-start gap-3 p-4 text-sm">
          <Icon className="text-brand-700 mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="text-ink-900 font-medium">Where this appears</p>
            <p className="text-ink-500 mt-0.5">{spec.appearsOn.join(" · ")}</p>
          </div>
        </div>
        <div className="glass flex items-center gap-3 p-4 text-sm">
          <span
            className={
              doc
                ? "bg-brand-500/10 text-brand-700 ring-brand-500/20 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                : "bg-ink-900/6 text-ink-500 ring-ink-900/10 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
            }
          >
            {doc ? "Customised" : "Built-in content"}
          </span>
          {doc && (
            <span className="text-ink-500 text-xs">
              Last saved {new Date(doc.updatedAt).toLocaleString()}
              {doc.updatedBy ? ` by ${doc.updatedBy}` : ""}
            </span>
          )}
        </div>
      </div>

      {problems.length > 0 && (
        <div
          className="mb-5 rounded-xl border border-red-200/80 bg-red-50/70 p-4 text-sm text-red-700"
          role="alert"
        >
          <p className="font-medium">A few required fields are still empty:</p>
          <ul className="mt-2 list-disc pl-5">
            {problems.slice(0, 12).map((p) => (
              <li key={p}>{p}</li>
            ))}
            {problems.length > 12 && <li>…and {problems.length - 12} more.</li>}
          </ul>
        </div>
      )}

      <Card>
        {!value ? (
          <div className="dash-shimmer h-64 rounded-lg" />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
            className="grid gap-5"
          >
            <FieldList fields={spec.fields} value={value} path={[]} ctx={{ set }} />
            <div className="sticky bottom-4 z-10 flex justify-end">
              <div className="glass glass-strong flex items-center gap-3 p-2 pl-4">
                <span className="text-ink-500 text-xs">
                  {dirty ? "You have unsaved changes." : "Everything is saved."}
                </span>
                <AdminButton type="submit" variant="primary" loading={saving} disabled={!dirty}>
                  <Save className="size-4" aria-hidden /> Save changes
                </AdminButton>
              </div>
            </div>
          </form>
        )}
      </Card>

      <ConfirmDialog
        open={confirmReset}
        title="Restore the built-in content?"
        text="Everything you changed in this section will be replaced by the website's original text and pictures. This cannot be undone."
        confirmLabel="Restore"
        danger
        loading={resetting}
        onConfirm={reset}
        onClose={() => setConfirmReset(false)}
      />
    </>
  );
}
