import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/content/ContentEditor";
import { getSection } from "@/lib/content/schema";

type Params = { section: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { section } = await params;
  return { title: getSection(section)?.title ?? "Website content" };
}

export default async function ContentSectionPage({ params }: { params: Promise<Params> }) {
  const { section } = await params;
  return <ContentEditor sectionId={section} />;
}
