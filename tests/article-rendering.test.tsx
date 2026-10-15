import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleRenderer } from "@/components/blog/ArticleRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { detail, summary } from "./fixtures";

describe("ArticleRenderer", () => {
  it("renders sanitized HTML with heading ids and callouts", () => {
    const { container } = render(<ArticleRenderer html={detail.contentHtml} />);
    expect(container.querySelector("h2#why-it-matters")).toHaveTextContent("Why it matters");
    expect(container.querySelector(".callout[data-type='info']")).toBeInTheDocument();
    expect(container.querySelector(".prose-article")).toBeInTheDocument();
  });
});

describe("TableOfContents", () => {
  it("links to every heading and nests level 3 items", () => {
    render(<TableOfContents items={detail.toc} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "#why-it-matters");
    expect(links[1]).toHaveClass("pl-7");
  });
  it("renders nothing for empty tocs", () => {
    const { container } = render(<TableOfContents items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("ArticleRow / FeaturedArticle", () => {
  it("shows category, title, excerpt, author, date and reading time", () => {
    render(<ArticleRow article={summary} index={0} />);
    expect(screen.getByRole("link", { name: "Networking" })).toHaveAttribute(
      "href",
      "/blog/category/networking",
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(summary.title);
    expect(screen.getByText(/8 min read/)).toBeInTheDocument();
    expect(screen.getByText("October 1, 2026")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: summary.author!.name })).toHaveAttribute(
      "href",
      "/blog/author/editorial-team",
    );
  });
  it("renders a search highlight when provided", () => {
    const { container } = render(
      <ArticleRow article={{ ...summary, highlight: "keeps <mark>networks</mark> dependable" }} />,
    );
    expect(container.querySelector("mark")).toHaveTextContent("networks");
  });
  it("featured article links to the article page", () => {
    render(<FeaturedArticle article={summary} />);
    expect(screen.getByRole("link", { name: /read article/i })).toHaveAttribute(
      "href",
      `/blog/${summary.slug}`,
    );
  });
});
