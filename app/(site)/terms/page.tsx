import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { company } from "@/lib/data/company";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({ title: "Terms of Use", path: "/terms" });

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="October 2026"
      sections={[
        {
          heading: "Use of this website",
          body: [
            `This website is operated by ${company.name}. By using it you agree to these terms. Content is provided for general information about our services and does not constitute an offer or professional advice.`,
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "Unless otherwise stated, the content, design and code of this website belong to Yaron Engineering PLC or its licensors. Third-party trademarks referenced on the partners page belong to their respective owners.",
          ],
        },
        {
          heading: "No warranty",
          body: [
            "We aim to keep information accurate and current but make no warranty as to completeness or accuracy. Project descriptions reflect work performed and are updated as new information is approved for publication.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms can be sent to ${company.contact.email}.`],
        },
      ]}
    />
  );
}
