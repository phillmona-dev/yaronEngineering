import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { company } from "@/lib/data/company";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({ title: "Privacy Policy", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={[
        {
          heading: "Who we are",
          body: [
            `${company.name} ("Yaron Engineering", "we") is headquartered in ${company.headquarters.city}, ${company.headquarters.country}. This policy explains how we handle information collected through this website.`,
          ],
        },
        {
          heading: "Information we collect",
          body: [
            "When you submit the contact form we receive the name, email address, organization, subject and message you provide. We use this information solely to respond to your enquiry.",
            "We do not use advertising trackers. Standard server logs may record technical information such as IP address and browser type for security and reliability purposes.",
          ],
        },
        {
          heading: "How we use information",
          body: [
            "Enquiry data is used to respond to you and, where relevant, to prepare a proposal. We do not sell personal information.",
          ],
        },
        {
          heading: "Retention and your rights",
          body: [
            `Enquiry data is retained only as long as needed to handle your request. To access, correct or delete your information, contact ${company.contact.email}.`,
          ],
        },
        {
          heading: "Third-party services",
          body: [
            "The contact page embeds a Google Maps view. Loading it is subject to Google's privacy policy.",
          ],
        },
      ]}
    />
  );
}
