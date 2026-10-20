/**
 * Built-in website content, assembled from the hand-written data in `lib/data/*` plus the copy
 * that used to live inside page components. This is what the site shows until the owner
 * customises a section in the admin panel, and what a section returns to after "Reset".
 *
 * Everything here must be plain JSON (no functions, no React components): it is diffed
 * against the stored overrides and edited in a form.
 */
import { company, stats, sectors, leadershipRoles } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { projectGroups, projects, projectCategories } from "@/lib/data/projects";
import { customers } from "@/lib/data/customers";
import { partners } from "@/lib/data/partners";
import { whyPrinciples } from "@/lib/data/why";
import { careerValues, openRoles } from "@/lib/data/careers";
import { processSteps, tailoringPillars } from "@/lib/data/solutions";
import { primaryNav, footerNav, legalNav } from "@/lib/data/navigation";
import type { SiteContent } from "./types";

const SERVICE_ICON_KEYS: Record<string, string> = {
  "ict-infrastructure": "network",
  "data-center": "server",
  "ict-consultancy": "briefcase",
  cybersecurity: "shield",
  "cloud-services": "cloud",
  "servers-storage": "storage",
  "physical-security": "cctv",
};

export const DEFAULT_CONTENT: SiteContent = {
  company: {
    name: company.name,
    shortName: company.shortName,
    legalName: company.legalName,
    tagline: company.tagline,
    slogan: company.slogan,
    description: company.description,
    founded: company.founded,
    foundedMonth: company.foundedMonth,
    headquarters: {
      city: company.headquarters.city,
      country: company.headquarters.country,
      countryCode: company.headquarters.countryCode,
      streetAddress: company.headquarters.streetAddress,
      lat: company.headquarters.geo.lat,
      lng: company.headquarters.geo.lng,
    },
    contact: {
      email: company.contact.email,
      salesEmail: company.contact.salesEmail,
      phones: [...company.contact.phones],
      whatsapp: company.contact.whatsapp,
      whatsappE164: company.contact.whatsappE164,
      whatsappGreeting: `Hello ${company.name}, I would like to discuss a project.`,
      officeHours: "Monday – Friday, East Africa Time (UTC+3)",
    },
    social: [...company.social],
  },

  about: {
    vision: company.vision,
    mission: company.mission,
    story: [...company.story],
    storyHeading: "Founded with a bold, forward-looking vision.",
    commitment: [...company.commitment],
    coreValues: company.coreValues.map((v) => ({ ...v })),
    businessLines: [...company.businessLines],
    businessAreas: company.businessAreas.map((a) => ({ ...a })),
    businessAreasLead:
      "End-to-end consulting, system integration and training across the full spectrum of ICT and security domains — each solution tailored to organizational goals, performance expectations and regulatory requirements.",
    serviceLines: company.serviceLines.map((l) => ({ ...l, items: [...l.items] })),
    sectors: [...sectors],
    leadershipRoles: [...leadershipRoles],
    expertise: {
      eyebrow: "Experience & expertise",
      years: 20,
      heading: "Years of engineering leadership behind every design review.",
      lead: "The founding team brings more than 20 years of combined leadership experience, including contributions to Ethiopia's flagship digital transformation initiatives and ICT modernization programmes.",
      note: "Leadership profiles and portraits will be published here once official team photography is supplied. We do not use stock or generated people.",
    },
  },

  home: {
    meta: {
      metaTitle: "Yaron Engineering PLC | ICT Infrastructure & Cybersecurity Solutions",
      metaDescription: company.description,
    },
    hero: {
      badge: "ICT Infrastructure & Cybersecurity Systems Integrator",
      titleLines: ["Engineering the", "infrastructure", "behind a secure", "digital future."],
      highlight: "secure",
      lead: `${company.shortName} delivers ICT infrastructure, cybersecurity, cloud, data center and enterprise technology solutions for organizations that cannot afford to compromise.`,
      primaryCta: { label: "Explore Our Solutions", href: "/solutions" },
      secondaryCta: { label: "Talk to Our Experts", href: "/contact" },
      panelNote: stats[0].note,
      panelText: `${stats[0].label} for government, finance and enterprise.`,
      dataPoints: [
        { label: "HQ", value: "Addis Ababa · 9.02°N 38.83°E" },
        { label: "Est.", value: "2018" },
        { label: "Focus", value: "ICT Infrastructure · Cybersecurity" },
      ],
    },
    stats: stats.map((s) => ({
      value: s.value,
      suffix: s.suffix,
      label: s.label,
      note: s.note,
      plain: "plain" in s ? Boolean(s.plain) : false,
    })),
    sections: {
      about: {
        eyebrow: "About Yaron Engineering",
        title: "Built in Addis Ababa to engineer the systems East Africa depends on.",
        highlight: "depends on.",
        ctaLabel: "Our story and vision",
      },
      services: {
        eyebrow: "Core competencies",
        title: "Seven disciplines. One accountable team.",
        highlight: "One",
        lead: "From the physical layer to the security operations center, we design, integrate and support the infrastructure organizations run on.",
        ctaLabel: "All services",
      },
      solutions: {
        eyebrow: "Solutions",
        title: "Technology built around your mission.",
        highlight: "your mission.",
        lead: "No two institutions share the same objectives, risk posture or growth curve. Every solution we deliver is tailored to the organization it serves — and engineered through one disciplined method.",
        ctaLabel: "How we work",
        pillarsHeading: "Every solution is tailored to",
      },
      industries: {
        eyebrow: "Industries",
        title: "Serving the institutions that cannot pause.",
        highlight: "cannot pause.",
        lead: "Government, finance, healthcare, education, NGOs and critical infrastructure — organizations where reliability and security are obligations, not features.",
        ctaLabel: "All industries",
      },
      projects: {
        eyebrow: "Experience",
        title: "More than 30 high-impact projects. Delivered.",
        highlight: "Delivered.",
        lead: "A selection of the programmes we have designed, implemented and supervised for the judiciary, banks, public institutions, universities, hospitality and enterprises.",
        ctaLabel: "All projects",
      },
      customers: {
        eyebrow: "National & Enterprise Partners",
        title: "Institutions that trust Yaron Engineering.",
        lead: "Mission-critical data center, cybersecurity, and cloud programmes delivered across Ethiopia.",
      },
      partners: {
        eyebrow: "Global partners",
        title: "Powered by global partnerships. Delivered locally.",
        highlight: "Delivered locally.",
        lead: "Powered by global partnerships, delivered locally. Direct partnerships with globally renowned vendors and regional distributors bring world-class technology to local organizations — and we deliver, support and integrate it across mission-critical environments.",
      },
      why: {
        eyebrow: "Why Yaron",
        title: "Why organizations choose Yaron.",
        highlight: "choose Yaron.",
        lead: "Six principles that shape how we design, deliver and stand behind critical infrastructure.",
      },
      commitment: {
        eyebrow: "Our commitment",
        titleLine1: "We don't just deploy systems.",
        titleLine2: "We build the infrastructure organizations depend on.",
        highlight: "organizations depend on.",
        outcomes: [
          {
            title: "Digitally transform",
            text: "Modern platforms and cloud foundations designed around how the organization actually operates.",
          },
          {
            title: "Scale securely",
            text: "Growth on an architecture where segmentation, identity and compliance were designed in from day one.",
          },
          {
            title: "Operate smarter",
            text: "Monitoring, documentation and support models that turn infrastructure into a managed capability.",
          },
        ],
      },
    },
    finalCta: {
      titleLine1: "Let's engineer",
      titleLine2: "what's next.",
      text: "Tell us what you're building, protecting or transforming. Our team can help architect the infrastructure behind it.",
      primary: { label: "Start a Conversation", href: "/contact" },
      secondary: { label: "Explore Our Services", href: "/services" },
    },
  },

  pages: {
    about: {
      metaTitle: "About",
      metaDescription:
        "Founded in 2018 in Addis Ababa, Yaron Engineering PLC is an ICT infrastructure and cybersecurity consulting and system integration firm serving Ethiopia and East Africa.",
      eyebrow: "About Yaron Engineering",
      titleLine1: "A systems integrator built for",
      titleLine2: "critical infrastructure.",
      highlight: "critical",
      lead: `Founded in ${company.foundedMonth} ${company.founded} and headquartered in ${company.headquarters.city}, ${company.headquarters.country}.`,
    },
    services: {
      metaTitle: "Services",
      metaDescription:
        "ICT infrastructure, data center design, ICT consultancy, cybersecurity, cloud, enterprise servers and storage, and physical security systems — delivered end to end by Yaron Engineering.",
      eyebrow: "Services",
      titleLine1: "From the physical layer",
      titleLine2: "to the security operations center.",
      highlight: "security",
      lead: "Seven core competencies, delivered as consulting, system integration, training and supply — by one accountable engineering team.",
      deliveryEyebrow: "How we deliver",
      deliveryTitle: "Consult, integrate, supply.",
      deliveryHighlight: "supply.",
    },
    solutions: {
      metaTitle: "Solutions",
      metaDescription:
        "Every Yaron Engineering solution is tailored to organizational objectives, performance, regulatory and security requirements, scalability and business continuity.",
      eyebrow: "Solutions",
      titleLine1: "Technology built around",
      titleLine2: "your mission.",
      highlight: "mission.",
      lead: "One disciplined method — discover, architect, integrate, secure, operate, scale — applied to every organization we serve.",
    },
    industries: {
      metaTitle: "Industries",
      metaDescription:
        "Yaron Engineering serves government, banking and financial services, insurance, healthcare, NGOs, enterprise, education and critical infrastructure across Ethiopia and East Africa.",
      eyebrow: "Industries",
      titleLine1: "Serving the institutions",
      titleLine2: "that cannot pause.",
      highlight: "cannot pause.",
      lead: "Eight sectors where reliability, security and compliance are obligations — and where Yaron Engineering has the depth to deliver.",
    },
    projects: {
      metaTitle: "Projects",
      metaDescription:
        "ICT infrastructure, data center, cybersecurity, surveillance and cloud projects delivered by Yaron Engineering for the judiciary, banks, public institutions, universities, NGOs and enterprises in Ethiopia.",
      eyebrow: "Projects & experience",
      titleLine1: "Infrastructure delivered",
      titleLine2: "for institutions that matter.",
      highlight: "matter.",
      lead: "More than 30 high-impact projects for more than 40 clients across government institutions, enterprises, NGOs and financial organizations — consultancy, system integration, supply and cloud services.",
      categories: [...projectCategories],
      indexEyebrow: "Project index",
      indexTitle: "Customers and project experience.",
      indexHighlight: "experience.",
    },
    partners: {
      metaTitle: "Partners",
      metaDescription:
        "Yaron Engineering works with leading technology vendors and major Ethiopian enterprises across banking, government, logistics and higher education.",
      eyebrow: "Global & domestic partners",
      titleLine1: "Partnerships that extend",
      titleLine2: "our capability.",
      highlight: "capability.",
      lead: "We design vendor-neutral and deliver with global technology leaders and leading Ethiopian enterprise institutions.",
      customersEyebrow: "Domestic & Enterprise Partners",
      customersTitle: "Enterprise partners & clients in Ethiopia.",
      customersLead:
        "Infrastructure, cybersecurity, surveillance and cloud systems delivered for the judiciary, government institutions, banks and microfinance, national enterprises, aviation, hospitality, NGOs and universities.",
    },
    careers: {
      metaTitle: "Careers",
      metaDescription:
        "Join Yaron Engineering PLC in Addis Ababa and build the ICT infrastructure and cybersecurity systems Ethiopia and East Africa depend on.",
      eyebrow: "Careers",
      titleLine1: "Engineer the systems",
      titleLine2: "a region depends on.",
      highlight: "depends on.",
      lead: "We hire engineers, consultants and project leaders who want their work to run banks, ministries and universities.",
      whyEyebrow: "Why join",
      whyHeading: "Serious work, senior mentorship, real impact.",
      rolesEyebrow: "Open roles",
      rolesHeading: "Current opportunities",
      noVacanciesText:
        "No vacancies are published at the moment. We review speculative applications from experienced network, data center, security and cloud engineers on a rolling basis.",
      applyLabel: "Send a speculative application",
      finalCta: {
        titleLine1: "Build what",
        titleLine2: "comes next.",
        text: "Tell us about your experience and the problems you want to work on.",
        primary: { label: "Contact Us", href: "/contact" },
        secondary: { label: "About Yaron", href: "/about" },
      },
    },
    contact: {
      metaTitle: "Contact",
      metaDescription:
        "Talk to Yaron Engineering PLC in Addis Ababa about ICT infrastructure, data center, cybersecurity, cloud and enterprise technology projects.",
      eyebrow: "Contact",
      titleLine1: "Let's talk about",
      titleLine2: "what you're building.",
      highlight: "building.",
      lead: "Tell us what you are building, protecting or transforming. An engineer — not a sales script — will respond.",
      whatsappLabel: "Chat on WhatsApp",
      whatsappNote: "replies during office hours",
    },
  },

  navigation: {
    primary: primaryNav.map((n) => ({ label: n.label, href: n.href })),
    footer: footerNav.map((g) => ({
      heading: g.heading,
      items: g.items.map((n) => ({ label: n.label, href: n.href })),
    })),
    legal: legalNav.map((n) => ({ label: n.label, href: n.href })),
    footerBlurb:
      "ICT infrastructure and cybersecurity consulting and system integration for government, financial institutions, enterprises and NGOs across Ethiopia and East Africa.",
    footerCtaHeading: "Start a project",
    footerCtaLabel: "Talk to our engineers",
  },

  services: {
    items: services.map((s) => ({
      slug: s.slug,
      index: s.index,
      title: s.title,
      shortTitle: s.shortTitle,
      summary: s.summary,
      description: [...s.description],
      capabilities: [...s.capabilities],
      outcomes: [...s.outcomes],
      image: { ...s.image },
      icon: SERVICE_ICON_KEYS[s.slug] ?? "network",
      theme: s.theme,
    })),
  },

  solutions: {
    steps: processSteps.map((s) => ({ ...s, points: [...s.points] })),
    pillars: tailoringPillars.map((p) => ({ ...p })),
  },

  industries: {
    items: industries.map((i) => ({ ...i, image: { ...i.image } })),
  },

  projects: {
    groups: projectGroups.map((g) => ({ ...g })),
    items: projects.map((p) => ({
      id: p.id,
      group: p.group,
      client: p.client,
      clientLogo: p.clientLogo ?? "",
      name: p.name,
      sector: p.sector,
      year: p.year ?? "",
      location: p.location,
      summary: p.summary,
      highlights: [...p.highlights],
      technologies: [...p.technologies],
      featured: Boolean(p.featured),
      image: p.featured ? { ...p.featured.image } : { src: "", alt: "" },
    })),
  },

  customers: {
    items: customers.map((c) => ({
      id: c.id,
      name: c.name,
      shortName: c.shortName ?? "",
      amharicName: c.amharicName ?? "",
      logo: c.logo ?? "",
      category: c.category,
      description: c.description,
      url: c.url ?? "",
    })),
  },

  partners: {
    items: partners.map((p) => ({
      name: p.name,
      logo: p.logo ?? "",
      category: p.category,
      url: p.url ?? "",
    })),
  },

  why: { principles: whyPrinciples.map((p) => ({ ...p })) },

  careers: {
    values: careerValues.map((v) => ({ ...v })),
    openRoles: openRoles.map((r) => ({ ...r })),
  },
};
