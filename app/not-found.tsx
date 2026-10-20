import { Button } from "@/components/ui/Button";
import { GridLines } from "@/components/ui/Backdrop";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section
          data-theme="dark"
          className="bg-ink-950 text-foreground relative flex min-h-[100svh] items-center overflow-hidden"
        >
          <GridLines className="text-white opacity-50" />
          <div className="container-x relative py-32">
            <p className="eyebrow text-ink-300">Error 404</p>
            <h1 className="text-h1 mt-6 max-w-[14ch] font-bold text-white">
              This route is not provisioned.
            </h1>
            <p className="text-body text-ink-300 mt-6 max-w-[48ch]">
              The page you requested does not exist or has moved.
            </p>
            <div className="mt-10 flex gap-4">
              <Button href="/">Back to home</Button>
              <Button href="/contact" variant="secondary" arrow={false}>
                Contact us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
