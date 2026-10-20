import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SkipLink } from "@/components/layout/SkipLink";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SiteContentProvider } from "@/lib/content/context";
import { getSiteContent } from "@/lib/content/server";

/**
 * Public site chrome. Admin routes live outside this group and render their own shell.
 * The merged website content (built-in defaults + what the owner edited in the admin panel)
 * is loaded once here and shared with every client component through context.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  return (
    <SiteContentProvider content={content}>
      <SmoothScroll />
      <SkipLink />
      <ScrollProgress />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CustomCursor />
    </SiteContentProvider>
  );
}
