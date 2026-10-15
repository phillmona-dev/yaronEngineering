import "server-only";
import type {
  ArticleDetail,
  ArticleSummary,
  Author,
  Category,
  Page,
  SitemapData,
  Tag,
} from "./types";

/**
 * Server-side client for the PUBLIC blog API. Every call is cached by Next's data cache and
 * tagged so the backend can revalidate precisely (see app/api/revalidate). Failures never throw
 * into pages: they return `null` / empty pages so the UI can show a graceful "unavailable" state.
 */
const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080"
).replace(/\/$/, "");
const BASE = `${API_URL}/api/v1/public`;
const REVALIDATE = Number(process.env.BLOG_REVALIDATE_SECONDS ?? 300);

export class BlogApiUnavailable extends Error {}

async function get<T>(
  path: string,
  tags: string[],
  opts: { revalidate?: number } = {},
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: opts.revalidate ?? REVALIDATE, tags: ["blog", ...tags] },
      headers: { Accept: "application/json" },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new BlogApiUnavailable(`${res.status} ${path}`);
    return (await res.json()) as T;
  } catch (err) {
    if (process.env.NODE_ENV !== "test")
      console.warn("[blog-api] unavailable:", path, err instanceof Error ? err.message : err);
    return null;
  }
}

const emptyPage = <T>(size = 12): Page<T> => ({
  content: [],
  page: 0,
  size,
  totalElements: 0,
  totalPages: 0,
  last: true,
});

export type ListParams = {
  page?: number;
  size?: number;
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  sort?: "newest" | "popular";
};

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params))
    if (v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const blogApi = {
  async listArticles(params: ListParams = {}): Promise<Page<ArticleSummary>> {
    const tags = ["articles"];
    if (params.category) tags.push(`category:${params.category}`);
    if (params.tag) tags.push(`tag:${params.tag}`);
    if (params.author) tags.push(`author:${params.author}`);
    return (
      (await get<Page<ArticleSummary>>(`/articles${qs(params)}`, tags)) ?? emptyPage(params.size)
    );
  },

  async featured(limit = 1): Promise<ArticleSummary[]> {
    return (await get<ArticleSummary[]>(`/articles/featured${qs({ limit })}`, ["articles"])) ?? [];
  },

  async article(slug: string): Promise<ArticleDetail | null> {
    return get<ArticleDetail>(`/articles/${encodeURIComponent(slug)}`, [
      "articles",
      `article:${slug}`,
    ]);
  },

  async related(slug: string, limit = 3): Promise<ArticleSummary[]> {
    return (
      (await get<ArticleSummary[]>(
        `/articles/${encodeURIComponent(slug)}/related${qs({ limit })}`,
        ["articles"],
      )) ?? []
    );
  },

  /** Search is never cached: it is user input. */
  async search(q: string, page = 0, size = 12): Promise<Page<ArticleSummary> | null> {
    if (!q || q.trim().length < 2) return emptyPage(size);
    try {
      const res = await fetch(`${BASE}/articles/search${qs({ q: q.trim(), page, size })}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new BlogApiUnavailable(String(res.status));
      return (await res.json()) as Page<ArticleSummary>;
    } catch {
      return null;
    }
  },

  async categories(all = false): Promise<Category[]> {
    return (
      (await get<Category[]>(`/categories${qs({ all: all || undefined })}`, ["categories"])) ?? []
    );
  },
  async category(slug: string): Promise<Category | null> {
    return get<Category>(`/categories/${encodeURIComponent(slug)}`, [
      "categories",
      `category:${slug}`,
    ]);
  },
  async tags(): Promise<Tag[]> {
    return (await get<Tag[]>("/tags", ["tags"])) ?? [];
  },
  async tag(slug: string): Promise<Tag | null> {
    return get<Tag>(`/tags/${encodeURIComponent(slug)}`, ["tags", `tag:${slug}`]);
  },
  async authors(): Promise<Author[]> {
    return (await get<Author[]>("/authors", ["authors"])) ?? [];
  },
  async author(slug: string): Promise<Author | null> {
    return get<Author>(`/authors/${encodeURIComponent(slug)}`, ["authors", `author:${slug}`]);
  },
  async sitemap(): Promise<SitemapData | null> {
    return get<SitemapData>("/sitemap", ["articles", "categories", "tags", "authors"], {
      revalidate: 3600,
    });
  },
};
