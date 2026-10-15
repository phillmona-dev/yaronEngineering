"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { admin, AdminApiError } from "@/lib/admin/client";
import {
  AdminButton,
  Card,
  ConfirmDialog,
  EmptyRow,
  Field,
  Modal,
  PageHeader,
  TableSkeleton,
  inputCls,
  td,
  th,
} from "./ui";
import { useToast } from "./Toast";
import { slugify } from "@/lib/blog/format";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url";
  required?: boolean;
  hint?: string;
  fromTitle?: boolean;
};

type Row = Record<string, unknown> & {
  id: string;
  name: string;
  slug?: string;
  articleCount?: number;
};

/** Generic list + create/edit/delete for categories, tags and authors. */
export function SimpleCrud({
  resource,
  title,
  description,
  fields,
  columns,
}: {
  resource: string;
  title: string;
  description: string;
  fields: FieldDef[];
  columns: { key: string; label: string; render?: (r: Row) => React.ReactNode }[];
}) {
  const toast = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(() => {
    admin
      .get<Row[] | { content: Row[] }>(resource)
      .then((r) => setRows(Array.isArray(r) ? r : r.content))
      .catch((e) => toast("error", e.message));
  }, [resource, toast]);
  useEffect(load, [load]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
      string,
      string
    >;
    const body: Record<string, unknown> = {};
    for (const f of fields)
      body[f.name] = f.type === "number" ? Number(form[f.name] || 0) : form[f.name] || null;
    setSaving(true);
    setErrors({});
    try {
      if (editing === "new") await admin.post(resource, body);
      else if (editing) await admin.put(`${resource}/${editing.id}`, body);
      toast("success", editing === "new" ? "Created." : "Saved.");
      setEditing(null);
      load();
    } catch (err) {
      if (err instanceof AdminApiError && err.errors?.length)
        setErrors(Object.fromEntries(err.errors.map((x) => [x.field, x.message])));
      toast("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleting) return;
    setSaving(true);
    try {
      await admin.del(`${resource}/${deleting.id}`);
      toast("success", "Deleted.");
      setDeleting(null);
      load();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  const current = editing && editing !== "new" ? editing : null;

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <AdminButton variant="primary" onClick={() => setEditing("new")}>
            <Plus className="size-4" aria-hidden /> New
          </AdminButton>
        }
      />
      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="border-ink-100 border-b">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={th}>
                    {c.label}
                  </th>
                ))}
                <th className={th} />
              </tr>
            </thead>
            <tbody className="divide-ink-100 divide-y">
              {rows === null ? (
                <TableSkeleton cols={columns.length + 1} />
              ) : rows.length === 0 ? (
                <EmptyRow
                  colSpan={columns.length + 1}
                  text="Nothing here yet. Create the first one."
                />
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-ink-50/60">
                    {columns.map((c) => (
                      <td key={c.key} className={td}>
                        {c.render ? c.render(r) : String(r[c.key] ?? "")}
                      </td>
                    ))}
                    <td className={`${td} text-right`}>
                      <div className="inline-flex gap-1">
                        <AdminButton
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditing(r)}
                          aria-label={`Edit ${r.name}`}
                        >
                          <Pencil className="size-3.5" />
                        </AdminButton>
                        <AdminButton
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleting(r)}
                          aria-label={`Delete ${r.name}`}
                        >
                          <Trash2 className="size-3.5 text-red-600" />
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={editing !== null}
        title={
          editing === "new"
            ? `New ${title.slice(0, -1).toLowerCase()}`
            : `Edit ${current?.name ?? ""}`
        }
        onClose={() => setEditing(null)}
      >
        <form onSubmit={save} className="flex flex-col gap-4" key={current?.id ?? "new"}>
          {fields.map((f) => (
            <Field
              key={f.name}
              label={f.label}
              htmlFor={`f-${f.name}`}
              hint={f.hint}
              error={errors[f.name]}
            >
              {f.type === "textarea" ? (
                <textarea
                  id={`f-${f.name}`}
                  name={f.name}
                  rows={4}
                  defaultValue={String(current?.[f.name] ?? "")}
                  className={inputCls}
                  required={f.required}
                />
              ) : (
                <input
                  id={`f-${f.name}`}
                  name={f.name}
                  type={f.type ?? "text"}
                  defaultValue={String(current?.[f.name] ?? "")}
                  className={inputCls}
                  required={f.required}
                  onBlur={
                    f.fromTitle
                      ? (e) => {
                          const slug = e.currentTarget.form?.elements.namedItem(
                            "slug",
                          ) as HTMLInputElement | null;
                          if (slug && !slug.value) slug.value = slugify(e.currentTarget.value);
                        }
                      : undefined
                  }
                />
              )}
            </Field>
          ))}
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton type="button" onClick={() => setEditing(null)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={saving}>
              Save
            </AdminButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete “${deleting?.name}”?`}
        text="This cannot be undone. Items still referenced by articles cannot be deleted."
        confirmLabel="Delete"
        danger
        loading={saving}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
