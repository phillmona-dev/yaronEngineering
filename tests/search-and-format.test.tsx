import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchForm } from "@/components/blog/SearchForm";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { estimateReadingTime, mediaUrl, slugify } from "@/lib/blog/format";

describe("SearchForm", () => {
  it("submits to /blog/search with the q parameter", () => {
    render(<SearchForm defaultValue="firewall" />);
    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/blog/search");
    expect(screen.getByRole("searchbox", { name: /search articles/i })).toHaveValue("firewall");
    expect(screen.getByRole("searchbox")).toHaveAttribute("name", "q");
  });
});

describe("CategoryNav", () => {
  const cats = [
    { id: "1", name: "Cybersecurity", slug: "cybersecurity", articleCount: 3 },
    { id: "2", name: "Cloud", slug: "cloud", articleCount: 0 },
  ];
  it("marks the active category with aria-current", () => {
    render(<CategoryNav categories={cats} active="cloud" />);
    expect(screen.getByRole("link", { name: "Cloud" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "All" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: /Cybersecurity/ })).toHaveAttribute(
      "href",
      "/blog/category/cybersecurity",
    );
  });
});

describe("format helpers", () => {
  it("slugifies titles", () => {
    expect(slugify("Building Resilient Enterprise Networks!")).toBe(
      "building-resilient-enterprise-networks",
    );
    expect(slugify("  Café — Über  ")).toBe("cafe-uber");
  });
  it("resolves relative and absolute media urls", () => {
    expect(mediaUrl("/images/x.jpg")).toBe("/images/x.jpg");
    expect(mediaUrl("https://api.example.com/media/files/a.webp")).toBe(
      "https://api.example.com/media/files/a.webp",
    );
    expect(mediaUrl("media/files/a.webp")).toBe("/media/files/a.webp");
  });
  it("estimates reading time from html", () => {
    const words = Array.from({ length: 660 }, () => "word").join(" ");
    expect(estimateReadingTime(`<p>${words}</p>`)).toBe(3);
    expect(estimateReadingTime("<p>short</p>")).toBe(1);
  });
});
