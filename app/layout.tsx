import type { Metadata, Viewport } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { JsonLd } from "@/components/layout/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, organizationSchema } from "@/lib/utils/seo";
import { SITE_URL } from "@/lib/utils/site";
import { company } from "@/lib/data/company";
import AiChat from "@/components/ai/AiChat";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s | ${company.name}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: company.name,
  keywords: [
    "ICT infrastructure Ethiopia",
    "cybersecurity Addis Ababa",
    "data center design Ethiopia",
    "system integrator East Africa",
    "cloud services Ethiopia",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: company.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL, types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` } },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable}`} data-theme="light">
      <body>
        <MotionProvider>{children}</MotionProvider>
        <AiChat />
        <JsonLd data={organizationSchema()} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: company.name,
            publisher: { "@id": `${SITE_URL}/#organization` },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/blog/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
      </body>
    </html>
  );
}
