import type { MetadataRoute } from "next";
import { services } from "@/lib/data/services";
import { absoluteUrl } from "@/lib/utils/site";
import { blogApi } from "@/lib/blog/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blog = await blogApi.sitemap();
  const staticRoutes = [
    "/",
    "/about",
    "/services",
    "/solutions",
    "/industries",
    "/projects",
    "/partners",
    "/careers",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/privacy" || path === "/terms" ? 0.2 : 0.7,
    })),
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...(blog?.articles ?? []).map((a) => ({
      url: absoluteUrl(`/blog/${a.slug}`),
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(blog?.categories ?? []).map((c) => ({
      url: absoluteUrl(`/blog/category/${c.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...(blog?.authors ?? []).map((a) => ({
      url: absoluteUrl(`/blog/author/${a.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
