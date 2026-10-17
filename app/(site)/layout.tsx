import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SkipLink } from "@/components/layout/SkipLink";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

/** Public site chrome. Admin routes live outside this group and render their own shell. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CustomCursor />
    </>
  );
}
