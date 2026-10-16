"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin/client";
import type { Settings } from "@/lib/blog/types";
import { AdminButton, Card, Field, PageHeader, inputCls } from "./ui";
import { useToast } from "./Toast";

export function SettingsForm() {
  const toast = useToast();
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    admin
      .get<Settings>("settings")
      .then(setS)
      .catch((e) => toast("error", e.message));
  }, [toast]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setSaving(true);
    try {
      setS(await admin.put<Settings>("settings", { ...s, ...data }));
      toast("success", "Settings saved.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Publication-wide defaults. Admin only." />
      <Card>
        {!s ? (
          <div className="dash-shimmer h-40 rounded-lg" />
        ) : (
          <form onSubmit={save} className="grid max-w-2xl gap-4">
            <Field label="Site title" htmlFor="siteTitle">
              <input
                id="siteTitle"
                name="siteTitle"
                defaultValue={s.siteTitle}
                className={inputCls}
              />
            </Field>
            <Field label="Blog title" htmlFor="blogTitle">
              <input
                id="blogTitle"
                name="blogTitle"
                defaultValue={s.blogTitle}
                className={inputCls}
              />
            </Field>
            <Field label="Blog tagline" htmlFor="blogTagline">
              <input
                id="blogTagline"
                name="blogTagline"
                defaultValue={s.blogTagline}
                className={inputCls}
              />
            </Field>
            <Field label="Newsletter heading" htmlFor="newsletterHeading">
              <input
                id="newsletterHeading"
                name="newsletterHeading"
                defaultValue={s.newsletterHeading}
                className={inputCls}
              />
            </Field>
            <Field label="Newsletter text" htmlFor="newsletterText">
              <textarea
                id="newsletterText"
                name="newsletterText"
                rows={3}
                defaultValue={s.newsletterText}
                className={inputCls}
              />
            </Field>
            <div>
              <AdminButton type="submit" variant="primary" loading={saving}>
                Save settings
              </AdminButton>
            </div>
          </form>
        )}
      </Card>
    </>
  );
}
