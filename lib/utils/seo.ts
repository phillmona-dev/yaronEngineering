import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import { absoluteUrl, SITE_URL } from "./site";

export const DEFAULT_TITLE = "Yaron Engineering PLC | ICT Infrastructure & Cybersecurity Solutions";
export const DEFAULT_DESCRIPTION = company.description;

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${company.name}` : DEFAULT_TITLE;
  const url = absoluteUrl(path);
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: company.name,
      locale: "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: company.name,
    url: SITE_URL,
    logo: absoluteUrl("/images/brand/yaron-logo.png"),
    description: company.description,
    foundingDate: String(company.founded),
    email: company.contact.email,
    telephone: company.contact.phonesE164[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: company.headquarters.streetAddress,
      addressLocality: company.headquarters.city,
      addressCountry: company.headquarters.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.headquarters.geo.lat,
      longitude: company.headquarters.geo.lng,
    },
    areaServed: ["Ethiopia", "East Africa"],
    knowsAbout: [
      "ICT infrastructure",
      "Data center design",
      "Cybersecurity",
      "Cloud services",
      "Enterprise servers and storage",
      "Physical security systems",
      "ICT consultancy",
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["Ethiopia", "East Africa"],
  };
}
