import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ADMIN_COOKIE, API_URL } from "@/lib/blog/server";
import type { ArticleDetail } from "@/lib/blog/types";
import { ArticlePreview } from "@/components/blog/ArticlePreview";

export const dynamic = "force-dynamic";
export const metadata = { title: "Preview", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) notFound();
  const res = await fetch(`${API_URL}/api/v1/articles/${encodeURIComponent(id)}/preview`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const article = (await res.json()) as ArticleDetail;
  return (
    <div className="-m-4 md:-m-6 lg:-m-8">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gold-500/40 bg-gold-500/15 px-4 py-2 text-sm text-gold-700">
        <span>
          <strong>Preview</strong> · {article.status} · This is how the article will appear once
          published.
        </span>
        <Link
          href={`/admin/articles/${article.id}/edit`}
          className="font-medium underline underline-offset-2"
        >
          Back to editor
        </Link>
      </div>
      <ArticlePreview article={article} />
    </div>
  );
}
