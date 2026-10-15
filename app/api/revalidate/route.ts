import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Called by the Spring Boot backend after publish / unpublish / update / archive.
 * Body: { secret, tags?: string[], paths?: string[] }
 *
 * Tags purge the fetch data cache; paths purge the full-route cache for the ISR'd blog pages.
 * Tags of the form `article:<slug>`, `category:<slug>`, `author:<slug>`, `tag:<slug>` are
 * mapped to their public paths automatically so the backend only needs to send tags.
 */
const TAG_PATHS: Record<string, (slug: string) => string> = {
  article: (s) => `/blog/${s}`,
  category: (s) => `/blog/category/${s}`,
  author: (s) => `/blog/author/${s}`,
  tag: (s) => `/blog/tag/${s}`,
};

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  let body: { secret?: string; tags?: string[]; paths?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid body" }, { status: 400 });
  }
  if (!secret || body.secret !== secret)
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

  const tags = (body.tags ?? []).filter((t) => typeof t === "string").slice(0, 50);
  const paths = new Set(
    (body.paths ?? []).filter((p) => typeof p === "string" && p.startsWith("/")).slice(0, 50),
  );

  for (const t of tags) {
    revalidateTag(t);
    const [kind, ...rest] = t.split(":");
    const slug = rest.join(":");
    if (slug && TAG_PATHS[kind]) paths.add(TAG_PATHS[kind](slug));
  }
  if (!tags.length && !paths.size) revalidateTag("blog");

  // Index pages and the dynamic article route always change with any editorial action.
  paths.add("/blog");
  paths.add("/blog/rss.xml");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/blog/author/[slug]", "page");
  revalidatePath("/blog/tag/[slug]", "page");
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({
    ok: true,
    revalidated: { tags, paths: [...paths] },
    at: new Date().toISOString(),
  });
}
