/** Small immutable helpers the content editor uses to read and write nested values by path. */
import type { FieldSpec } from "./schema";

export type Path = (string | number)[];

export function getAt(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

export function setAt<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[head as number] = setAt(copy[head as number], rest, value);
    return copy as T;
  }
  const base = (obj ?? {}) as Record<string | number, unknown>;
  return { ...base, [head]: setAt(base[head], rest, value) } as T;
}

/** A blank value for a field, used when the editor adds a new list item. */
export function emptyValue(spec: FieldSpec): unknown {
  switch (spec.type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "list":
    case "array":
      return [];
    case "group":
      return Object.fromEntries(spec.fields.map((f) => [f.key, emptyValue(f)]));
    case "select":
      return spec.options[0]?.value ?? "";
    default:
      return "";
  }
}

/** Collect "<label> is required" problems for the whole document. */
export function validate(fields: FieldSpec[], value: unknown, trail: string[] = []): string[] {
  const problems: string[] = [];
  const obj = (value ?? {}) as Record<string, unknown>;
  for (const f of fields) {
    const v = obj[f.key];
    const label = [...trail, f.label].join(" › ");
    if (f.type === "group") problems.push(...validate(f.fields, v, [...trail, f.label]));
    else if (f.type === "array") {
      (Array.isArray(v) ? v : []).forEach((item, i) => {
        const name = (item as Record<string, unknown>)?.[f.itemLabel];
        problems.push(
          ...validate(f.fields, item, [
            ...trail,
            `${f.label} #${i + 1}${name ? ` (${name})` : ""}`,
          ]),
        );
      });
    } else if ("required" in f && f.required) {
      if (typeof v === "string" ? v.trim() === "" : v === undefined || v === null)
        problems.push(`${label} is required.`);
    }
  }
  return problems;
}
