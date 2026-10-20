import type { SiteContent } from "./types";

type Plain = Record<string, unknown>;

const isPlain = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Overlay a stored section document on top of its built-in default.
 *
 * - Objects merge key by key, so a document saved before a field was added still gets the
 *   new field's default.
 * - Arrays are replaced wholesale (a list the owner edited is exactly what they want), but
 *   each array item is still filled in from the default's first item so new per-item fields
 *   get a sensible empty value instead of `undefined`.
 * - A value whose type disagrees with the default is ignored, which protects pages from a
 *   hand-edited document with the wrong shape.
 */
export function mergeSection<T>(defaults: T, override: unknown): T {
  return mergeValue(defaults, override) as T;
}

function mergeValue(def: unknown, over: unknown): unknown {
  if (over === undefined || over === null) return def;
  if (Array.isArray(def)) {
    if (!Array.isArray(over)) return def;
    const template = def[0];
    return over.map((item) =>
      isPlain(template) && isPlain(item) ? mergeValue(template, item) : item,
    );
  }
  if (isPlain(def)) {
    if (!isPlain(over)) return def;
    const out: Plain = { ...def };
    for (const key of Object.keys(def)) out[key] = mergeValue(def[key], over[key]);
    return out;
  }
  // Primitive: accept only a same-typed value. Numbers may arrive as numeric strings from forms.
  if (typeof def === "number") {
    const n = typeof over === "number" ? over : Number(over);
    return Number.isFinite(n) ? n : def;
  }
  if (typeof def === "boolean") return typeof over === "boolean" ? over : def;
  if (typeof def === "string") return typeof over === "string" ? over : def;
  return over;
}

export function mergeSiteContent(
  defaults: SiteContent,
  overrides: Partial<Record<keyof SiteContent, unknown>>,
): SiteContent {
  const out = { ...defaults } as Record<string, unknown>;
  for (const key of Object.keys(defaults) as (keyof SiteContent)[]) {
    if (overrides[key] !== undefined) out[key] = mergeSection(defaults[key], overrides[key]);
  }
  return out as SiteContent;
}
