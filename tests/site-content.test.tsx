import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mergeSection, mergeSiteContent } from "@/lib/content/merge";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { Highlight, whatsappHref } from "@/lib/content/highlight";
import { getAt, setAt, validate } from "@/lib/content/form";
import { SECTIONS } from "@/lib/content/schema";

describe("mergeSection", () => {
  it("fills missing keys from the defaults and keeps overrides", () => {
    const out = mergeSection({ a: "x", b: { c: 1, d: "y" } }, { b: { c: 2 } });
    expect(out).toEqual({ a: "x", b: { c: 2, d: "y" } });
  });

  it("replaces arrays wholesale but completes each item from the template", () => {
    const out = mergeSection(
      { items: [{ title: "t", text: "x" }] },
      { items: [{ title: "only" }] },
    );
    expect(out.items).toEqual([{ title: "only", text: "x" }]);
  });

  it("ignores values of the wrong type", () => {
    const out = mergeSection({ n: 3, s: "a", list: ["x"] }, { n: "nope", s: 5, list: "bad" });
    expect(out).toEqual({ n: 3, s: "a", list: ["x"] });
  });

  it("accepts numeric strings for numbers", () => {
    expect(mergeSection({ n: 1 }, { n: "42" })).toEqual({ n: 42 });
  });

  it("leaves untouched sections at their defaults", () => {
    const merged = mergeSiteContent(DEFAULT_CONTENT, { company: { name: "Acme" } });
    expect(merged.company.name).toBe("Acme");
    expect(merged.company.contact.email).toBe(DEFAULT_CONTENT.company.contact.email);
    expect(merged.services).toBe(DEFAULT_CONTENT.services);
  });
});

describe("schema", () => {
  it("every section's fields exist in the built-in content", () => {
    for (const section of SECTIONS) {
      const value = DEFAULT_CONTENT[section.id] as Record<string, unknown>;
      for (const f of section.fields) expect(value, `${section.id}.${f.key}`).toHaveProperty(f.key);
      expect(validate(section.fields, value), section.id).toEqual([]);
    }
  });

  it("reports missing required fields with a readable path", () => {
    const home = SECTIONS.find((s) => s.id === "home")!;
    const broken = setAt(DEFAULT_CONTENT.home, ["hero", "primaryCta", "label"], "");
    expect(validate(home.fields, broken)).toContain(
      "Hero (top of the page) › Main button › Button text is required.",
    );
  });
});

describe("form helpers", () => {
  it("setAt is immutable and getAt reads back", () => {
    const base = { a: [{ b: 1 }] };
    const next = setAt(base, ["a", 0, "b"], 2);
    expect(getAt(next, ["a", 0, "b"])).toBe(2);
    expect(base.a[0].b).toBe(1);
  });
});

describe("Highlight", () => {
  it("wraps the accent phrase and leaves text alone when it is absent", () => {
    render(
      <h1>
        <Highlight text="Serving the institutions that cannot pause." highlight="cannot pause." />
      </h1>,
    );
    expect(screen.getByText("cannot pause.").tagName).toBe("SPAN");
    render(
      <p data-testid="plain">
        <Highlight text="Hello" highlight="missing" />
      </p>,
    );
    expect(screen.getByTestId("plain").querySelector("span")).toBeNull();
  });

  it("builds a WhatsApp link from a display number", () => {
    expect(whatsappHref("+251 944 159 690", "Hi there")).toBe(
      "https://wa.me/251944159690?text=Hi%20there",
    );
  });
});
