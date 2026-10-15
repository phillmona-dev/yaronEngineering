import { blogApi } from "@/lib/blog/api";
import { absoluteUrl, SITE_URL } from "@/lib/utils/site";
import { company } from "@/lib/data/company";

export const revalidate = 600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const list = await blogApi.listArticles({ size: 30, sort: "newest" });
  const items = list.content
    .map((a) => {
      const url = absoluteUrl(`/blog/${a.slug}`);
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(a.excerpt)}</description>
      ${a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ""}
      ${a.author ? `<dc:creator>${esc(a.author.name)}</dc:creator>` : ""}
      ${a.category ? `<category>${esc(a.category.name)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(company.shortName)} Insights</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc("Perspectives from Yaron Engineering on infrastructure, cybersecurity, cloud, enterprise technology and digital transformation.")}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
