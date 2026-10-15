import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/layout/JsonLd";
import { company } from "@/lib/data/company";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Talk to Yaron Engineering PLC in Addis Ababa about ICT infrastructure, data center, cybersecurity, cloud and enterprise technology projects.",
  path: "/contact",
});

const mapQuery = encodeURIComponent(`${company.name}, ${company.headquarters.full}`);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <PageHero
        compact
        eyebrow="Contact"
        crumbs={[{ label: "Contact", href: "/contact" }]}
        title={[
          <span key="a">Let&apos;s talk about</span>,
          <span key="b">
            what you&apos;re <span className="text-brand-300">building.</span>
          </span>,
        ]}
        lead="Tell us what you are building, protecting or transforming. An engineer — not a sales script — will respond."
        image={{ src: "/images/photos/towers-glass.jpg", alt: "Glass towers from below" }}
      />

      <Section theme="light" aria-label="Contact details and form">
        <div className="container-x grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Headquarters</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-h3 mt-6 font-semibold">{company.name}</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <address className="mt-8 flex flex-col gap-6 not-italic">
                <div className="flex gap-4">
                  <MapPin
                    className="text-brand mt-1 size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div>
                    <p className="eyebrow mb-2">Address</p>
                    <p className="text-[0.9375rem] leading-relaxed">
                      {company.headquarters.streetAddress}
                      <br />
                      {company.headquarters.city}, {company.headquarters.country}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="text-brand mt-1 size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                  <div>
                    <p className="eyebrow mb-2">Email</p>
                    <a
                      href={`mailto:${company.contact.email}`}
                      className="hover:text-brand-text block text-[0.9375rem]"
                    >
                      {company.contact.email}
                    </a>
                    <a
                      href={`mailto:${company.contact.salesEmail}`}
                      className="text-muted-foreground hover:text-brand-text block text-[0.9375rem]"
                    >
                      {company.contact.salesEmail}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone
                    className="text-brand mt-1 size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div>
                    <p className="eyebrow mb-2">Phone</p>
                    {company.contact.phones.map((p, i) => (
                      <a
                        key={p}
                        href={`tel:${company.contact.phonesE164[i]}`}
                        className="hover:text-brand-text block text-[0.9375rem]"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </address>
            </Reveal>
            <Reveal delay={0.2} className="border-border mt-10 border-t pt-6">
              <p className="eyebrow mb-2">Office hours</p>
              <p className="text-muted-foreground text-sm">
                Monday – Friday, East Africa Time (UTC+3)
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </Section>

      <section data-theme="dark" className="bg-ink-950" aria-label="Map">
        <div className="relative h-[420px] w-full lg:h-[520px]">
          <iframe
            title={`Map showing ${company.name} headquarters in Addis Ababa`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed&z=15`}
            className="absolute inset-0 h-full w-full border-0 contrast-[1.05] grayscale-[0.4]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}
