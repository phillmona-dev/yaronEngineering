import { ArticleEditorLoader } from "@/components/admin/ArticleEditorLoader";
export const metadata = { title: "Edit article" };
export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleEditorLoader id={id} />;
}
