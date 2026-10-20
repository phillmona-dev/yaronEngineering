"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { FieldSpec } from "@/lib/content/schema";
import { emptyValue, type Path } from "@/lib/content/form";
import { AdminButton, inputCls, labelCls } from "@/components/admin/ui";
import { ImagePicker } from "./ImagePicker";

type Ctx = { set: (path: Path, value: unknown) => void };

/** Renders a list of field specs against a value object. Recursive for groups and arrays. */
export function FieldList({
  fields,
  value,
  path,
  ctx,
  depth = 0,
}: {
  fields: FieldSpec[];
  value: Record<string, unknown>;
  path: Path;
  ctx: Ctx;
  depth?: number;
}) {
  return (
    <div className="grid gap-5">
      {fields.map((f) => (
        <FieldView
          key={f.key}
          spec={f}
          value={value?.[f.key]}
          path={[...path, f.key]}
          ctx={ctx}
          depth={depth}
        />
      ))}
    </div>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="text-ink-400 mt-1 text-xs leading-relaxed">{text}</p> : null;
}

function FieldView({
  spec,
  value,
  path,
  ctx,
  depth,
}: {
  spec: FieldSpec;
  value: unknown;
  path: Path;
  ctx: Ctx;
  depth: number;
}) {
  const id = path.join(".");
  const required = "required" in spec && spec.required;
  const labelEl = (
    <label htmlFor={id} className={labelCls}>
      {spec.label}
      {required && (
        <span className="text-gold-700 ml-1" aria-hidden>
          *
        </span>
      )}
    </label>
  );

  switch (spec.type) {
    case "text":
    case "url":
    case "email":
      return (
        <div>
          {labelEl}
          <input
            id={id}
            type={spec.type === "text" ? "text" : spec.type}
            value={String(value ?? "")}
            placeholder={spec.placeholder}
            onChange={(e) => ctx.set(path, e.target.value)}
            className={inputCls}
          />
          <Help text={spec.help} />
        </div>
      );
    case "number":
      return (
        <div>
          {labelEl}
          <input
            id={id}
            type="number"
            step="any"
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) => ctx.set(path, e.target.value === "" ? 0 : Number(e.target.value))}
            className={cn(inputCls, "max-w-xs")}
          />
          <Help text={spec.help} />
        </div>
      );
    case "textarea":
      return (
        <div>
          {labelEl}
          <textarea
            id={id}
            rows={spec.rows ?? 3}
            value={String(value ?? "")}
            placeholder={spec.placeholder}
            onChange={(e) => ctx.set(path, e.target.value)}
            className={inputCls}
          />
          <Help text={spec.help} />
        </div>
      );
    case "boolean":
      return (
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => ctx.set(path, e.target.checked)}
              className="accent-brand-500 mt-0.5 size-4"
            />
            <span>
              <span className="text-ink-900 block text-sm font-medium">{spec.label}</span>
              <Help text={spec.help} />
            </span>
          </label>
        </div>
      );
    case "select":
      return (
        <div>
          {labelEl}
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(e) => ctx.set(path, e.target.value)}
            className={cn(inputCls, "max-w-xs")}
          >
            {spec.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help text={spec.help} />
        </div>
      );
    case "image":
      return (
        <div>
          {labelEl}
          <ImagePicker id={id} value={String(value ?? "")} onChange={(src) => ctx.set(path, src)} />
          <Help text={spec.help} />
        </div>
      );
    case "list":
      return (
        <StringList
          spec={spec}
          value={Array.isArray(value) ? (value as string[]) : []}
          path={path}
          ctx={ctx}
        />
      );
    case "group":
      return (
        <fieldset
          className={cn(
            "rounded-xl border border-white/80 bg-white/35 p-4 sm:p-5",
            depth > 0 && "bg-white/25",
          )}
        >
          <legend className="text-ink-900 px-1 text-sm font-semibold">{spec.label}</legend>
          <Help text={spec.help} />
          <div className={spec.help ? "mt-4" : "mt-1"}>
            <FieldList
              fields={spec.fields}
              value={(value ?? {}) as Record<string, unknown>}
              path={path}
              ctx={ctx}
              depth={depth + 1}
            />
          </div>
        </fieldset>
      );
    case "array":
      return (
        <ArrayField
          spec={spec}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          path={path}
          ctx={ctx}
          depth={depth}
        />
      );
  }
}

/** A list of short strings: one input per row with add / remove / reorder. */
function StringList({
  spec,
  value,
  path,
  ctx,
}: {
  spec: Extract<FieldSpec, { type: "list" }>;
  value: string[];
  path: Path;
  ctx: Ctx;
}) {
  const update = (next: string[]) => ctx.set(path, next);
  return (
    <div>
      <span className={labelCls}>{spec.label}</span>
      <div className="grid gap-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              rows={item.length > 70 ? 2 : 1}
              value={item}
              placeholder={spec.placeholder}
              onChange={(e) => update(value.map((v, j) => (j === i ? e.target.value : v)))}
              className={cn(inputCls, "min-h-9 resize-y")}
              aria-label={`${spec.label} ${i + 1}`}
            />
            <RowTools
              index={i}
              count={value.length}
              onMove={(to) => {
                const next = [...value];
                const [m] = next.splice(i, 1);
                next.splice(to, 0, m);
                update(next);
              }}
              onRemove={() => update(value.filter((_, j) => j !== i))}
            />
          </div>
        ))}
        <div>
          <AdminButton type="button" size="sm" onClick={() => update([...value, ""])}>
            <Plus className="size-3.5" aria-hidden /> Add line
          </AdminButton>
        </div>
      </div>
      <Help text={spec.help} />
    </div>
  );
}

function RowTools({
  index,
  count,
  onMove,
  onRemove,
  onDuplicate,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
}) {
  const btn =
    "text-ink-400 hover:text-ink-900 hover:bg-white/80 grid size-8 place-items-center rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className="flex shrink-0 items-center">
      <button
        type="button"
        className={btn}
        onClick={() => onMove(index - 1)}
        disabled={index === 0}
        aria-label="Move up"
        title="Move up"
      >
        <ArrowUp className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        aria-label="Move down"
        title="Move down"
      >
        <ArrowDown className="size-3.5" aria-hidden />
      </button>
      {onDuplicate && (
        <button
          type="button"
          className={btn}
          onClick={onDuplicate}
          aria-label="Duplicate"
          title="Duplicate"
        >
          <Copy className="size-3.5" aria-hidden />
        </button>
      )}
      <button
        type="button"
        className={cn(btn, "hover:text-red-600")}
        onClick={onRemove}
        aria-label="Remove"
        title="Remove"
      >
        <Trash2 className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}

/** A list of objects: each item is a collapsible card with its own fields. */
function ArrayField({
  spec,
  value,
  path,
  ctx,
  depth,
}: {
  spec: Extract<FieldSpec, { type: "array" }>;
  value: Record<string, unknown>[];
  path: Path;
  ctx: Ctx;
  depth: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(value.length <= 3 ? 0 : null);
  const update = (next: Record<string, unknown>[]) => ctx.set(path, next);

  function add() {
    const blank = emptyValue(spec) as Record<string, unknown>;
    const item = Object.fromEntries(spec.fields.map((f) => [f.key, emptyValue(f)]));
    update([...value, { ...blank, ...item }]);
    setOpenIndex(value.length);
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-white/80 bg-white/35 p-4 sm:p-5",
        depth > 0 && "bg-white/25",
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-ink-900 text-sm font-semibold">
            {spec.label} <span className="text-ink-400 font-normal">({value.length})</span>
          </p>
          <Help text={spec.help} />
        </div>
        <AdminButton type="button" size="sm" onClick={add}>
          <Plus className="size-3.5" aria-hidden /> {spec.addLabel ?? "Add item"}
        </AdminButton>
      </div>

      <ol className="mt-4 grid gap-2">
        {value.map((item, i) => {
          const name = String(item?.[spec.itemLabel] ?? "").trim() || `Item ${i + 1}`;
          const open = openIndex === i;
          return (
            <li key={i} className="overflow-hidden rounded-lg border border-white/80 bg-white/50">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="text-ink-900 flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-white/70"
                >
                  <span className="text-ink-400 w-6 shrink-0 font-mono text-[0.68rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{name}</span>
                  {open ? (
                    <ChevronUp className="text-ink-400 ml-auto size-4 shrink-0" aria-hidden />
                  ) : (
                    <ChevronDown className="text-ink-400 ml-auto size-4 shrink-0" aria-hidden />
                  )}
                </button>
                <RowTools
                  index={i}
                  count={value.length}
                  onMove={(to) => {
                    const next = [...value];
                    const [m] = next.splice(i, 1);
                    next.splice(to, 0, m);
                    update(next);
                    setOpenIndex(to);
                  }}
                  onDuplicate={() => {
                    const next = [...value];
                    next.splice(i + 1, 0, JSON.parse(JSON.stringify(item)));
                    update(next);
                    setOpenIndex(i + 1);
                  }}
                  onRemove={() => {
                    if (
                      !window.confirm(
                        `Remove “${name}”? You can still cancel by leaving without saving.`,
                      )
                    )
                      return;
                    update(value.filter((_, j) => j !== i));
                    setOpenIndex(null);
                  }}
                />
              </div>
              {open && (
                <div className="border-t border-white/80 p-4">
                  <FieldList
                    fields={spec.fields}
                    value={item}
                    path={[...path, i]}
                    ctx={ctx}
                    depth={depth + 1}
                  />
                </div>
              )}
            </li>
          );
        })}
        {value.length === 0 && (
          <li className="text-ink-400 rounded-lg border border-dashed border-white/80 px-4 py-6 text-center text-sm">
            Nothing here yet.
          </li>
        )}
      </ol>
    </div>
  );
}
