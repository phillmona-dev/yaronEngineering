import type { ArticleDetail, ArticleSummary } from "@/lib/blog/types";

export const summary: ArticleSummary = {
  id: "a1",
  slug: "building-resilient-enterprise-network-infrastructure",
  title: "Building Resilient Enterprise Network Infrastructure",
  excerpt: "How segmentation, redundancy and documentation keep enterprise networks dependable.",
  coverImage: {
    id: "m1",
    url: "/images/photos/network-patch.jpg",
    altText: "Patch panel",
    width: 2200,
    height: 1467,
    mimeType: "image/jpeg",
  },
  category: { id: "c1", name: "Networking", slug: "networking" },
  tags: [{ id: "t1", name: "LAN", slug: "lan" }],
  author: {
    id: "u1",
    name: "Yaron Engineering Editorial Team",
    slug: "editorial-team",
    position: "Editorial",
    avatar: null,
  },
  status: "PUBLISHED",
  featured: true,
  readingTimeMinutes: 8,
  viewCount: 120,
  publishedAt: "2026-10-01T06:00:00Z",
  scheduledAt: null,
  createdAt: "2026-09-30T06:00:00Z",
  updatedAt: "2026-10-01T06:00:00Z",
};

export const detail: ArticleDetail = {
  ...summary,
  contentHtml:
    '<h2 id="why-it-matters">Why it matters</h2><p>Networks fail at the <strong>seams</strong>.</p><h3 id="segmentation">Segmentation</h3><p>Policy first.</p><div class="callout" data-type="info"><p>Design note.</p></div>',
  contentJson: null,
  toc: [
    { id: "why-it-matters", text: "Why it matters", level: 2 },
    { id: "segmentation", text: "Segmentation", level: 3 },
  ],
  seo: { title: null, description: "Meta", canonicalUrl: null, ogImage: null, noIndex: false },
  related: [],
};
