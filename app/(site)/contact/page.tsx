import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon } from "@/components/blog/SocialIcons";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/utils/seo";
import { getSiteContent } from "@/lib/content/server";
import { pageHeroProps } from "@/lib/content/highlight";
import { phoneToE164, whatsappHref } from "@/lib/content/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSiteContent();
  return pageMetadata({
    title: pages.contact.metaTitle,
    description: pages.contact.metaDescription,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const { company, pages } = await getSiteContent();
  const copy = pages.contact;
  const hq = company.headquarters;
  const mapQuery = encodeURIComponent(
    `${company.name}, ${hq.streetAddress}, ${hq.city}, ${hq.country}`,
  );
  const waHref = whatsappHref(company.contact.whatsappE164, company.contact.whatsappGreeting);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <PageHero
        compact
        {...pageHeroProps(copy)}
        crumbs={[{ label: "Contact", href: "/contact" }]}
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
                    <p className="text-body">
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
                      className="hover:text-brand-text text-body block"
                    >
                      {company.contact.email}
                    </a>
                    <a
                      href={`mailto:${company.contact.salesEmail}`}
                      className="text-muted-foreground hover:text-brand-text text-body block"
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
                    {company.contact.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:${phoneToE164(p)}`}
                        className="hover:text-brand-text text-body block"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </address>
            </Reveal>
            <Reveal delay={0.16} className="mt-8">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ease-out-expo focus-visible:ring-gold-400 focus-visible:ring-offset-background text-body inline-flex h-11 items-center gap-2.5 rounded-full bg-[#25D366] px-6 font-semibold text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
              >
                <WhatsAppIcon className="size-[18px] shrink-0" />
                {copy.whatsappLabel}
              </a>
              <p className="text-muted-foreground text-body mt-3">
                {company.contact.whatsapp} · {copy.whatsappNote}
              </p>
            </Reveal>
            <Reveal delay={0.2} className="border-border mt-10 border-t pt-6">
              <p className="eyebrow mb-2">Office hours</p>
              <p className="text-muted-foreground text-body">{company.contact.officeHours}</p>
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
