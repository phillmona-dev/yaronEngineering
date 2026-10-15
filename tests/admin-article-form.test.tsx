import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/articles/new",
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("next/dynamic", () => ({
  default: () =>
    function EditorStub() {
      return <div data-testid="editor" />;
    },
}));

import { ArticleForm } from "@/components/admin/ArticleForm";
import { ToastProvider } from "@/components/admin/Toast";

const calls: { url: string; init?: RequestInit }[] = [];

beforeEach(() => {
  calls.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      const json = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), {
          status,
          headers: { "Content-Type": "application/json" },
        });
      if (url.endsWith("/categories")) return json([{ id: "c1", name: "Cloud", slug: "cloud" }]);
      if (url.endsWith("/tags")) return json([{ id: "t1", name: "Azure", slug: "azure" }]);
      if (url.endsWith("/authors"))
        return json([{ id: "a1", name: "Editorial Team", slug: "editorial" }]);
      if (url.endsWith("/articles") && init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        return json(
          {
            id: "new-1",
            slug: "cloud-adoption",
            status: "DRAFT",
            featured: false,
            title: body.title,
            excerpt: body.excerpt,
            contentHtml: "",
            contentJson: null,
            toc: [],
            seo: {
              title: null,
              description: null,
              canonicalUrl: null,
              ogImage: null,
              noIndex: false,
            },
            related: [],
            tags: [],
            coverImage: null,
            category: null,
            author: null,
            readingTimeMinutes: 1,
            viewCount: 0,
            publishedAt: null,
            scheduledAt: null,
            createdAt: "",
            updatedAt: "",
          },
          201,
        );
      }
      return json({});
    }),
  );
});

describe("Admin article creation", () => {
  it("creates a draft via POST /api/admin/articles with the typed title and excerpt", async () => {
    render(
      <ToastProvider>
        <ArticleForm initial={null} user={{ id: "u", email: "e@x", name: "Ed", role: "EDITOR" }} />
      </ToastProvider>,
    );
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Cloud adoption" } });
    fireEvent.blur(screen.getByLabelText("Title")); // slug is derived from the title on blur
    fireEvent.change(screen.getByLabelText("Excerpt"), { target: { value: "A short summary." } });
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));
    await waitFor(() =>
      expect(calls.some((c) => c.url === "/api/admin/articles" && c.init?.method === "POST")).toBe(
        true,
      ),
    );
    const post = calls.find((c) => c.url === "/api/admin/articles" && c.init?.method === "POST")!;
    const body = JSON.parse(String(post.init!.body));
    expect(body.title).toBe("Cloud adoption");
    expect(body.excerpt).toBe("A short summary.");
    expect(body.slug).toBe("cloud-adoption");
    await screen.findByText(/draft saved/i);
  });

  it("refuses to save without a title", async () => {
    render(
      <ToastProvider>
        <ArticleForm initial={null} user={null} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));
    await screen.findByText(/give the article a title/i);
    expect(calls.some((c) => c.init?.method === "POST")).toBe(false);
  });

  it("shows the publish checklist with missing items", () => {
    render(
      <ToastProvider>
        <ArticleForm initial={null} user={{ id: "u", email: "e@x", name: "Ed", role: "EDITOR" }} />
      </ToastProvider>,
    );
    const checklist = screen.getByText("Title", { selector: "li" }).closest("ul")!;
    expect(checklist).toHaveTextContent("Cover image");
    expect(checklist).toHaveTextContent("SEO description");
    expect(checklist.querySelectorAll("li")).toHaveLength(7);
    expect(screen.getByRole("button", { name: /publish/i })).toBeInTheDocument();
  });
});
