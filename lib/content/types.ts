/**
 * Shape of every editable section of the public website.
 *
 * The built-in values live in `lib/content/defaults.ts` (derived from `lib/data/*`). The
 * admin "Website content" area stores overrides per section in the backend; `getSiteContent()`
 * merges those over the defaults so a missing or partially filled override never breaks a page.
 */

export type Cta = { label: string; href: string };
export type ImageRef = { src: string; alt: string };
export type NavItem = { label: string; href: string };
export type TitledText = { title: string; text: string };

/** Page-hero copy shared by every inner page. `highlight` is coloured gold inside line 2. */
export type HeroCopy = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  highlight: string;
  lead: string;
};

export type PageMeta = { metaTitle: string; metaDescription: string };

/** Section intro used by the home-page blocks. `highlight` is coloured blue inside `title`. */
export type SectionIntro = {
  eyebrow: string;
  title: string;
  highlight: string;
  lead: string;
};

export type CompanyContent = {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  slogan: string;
  description: string;
  founded: number;
  foundedMonth: string;
  headquarters: {
    city: string;
    country: string;
    countryCode: string;
    streetAddress: string;
    lat: number;
    lng: number;
  };
  contact: {
    email: string;
    salesEmail: string;
    phones: string[];
    whatsapp: string;
    whatsappE164: string;
    whatsappGreeting: string;
    officeHours: string;
  };
  social: NavItem[];
};

export type AboutContent = {
  vision: string;
  mission: string;
  story: string[];
  storyHeading: string;
  commitment: string[];
  coreValues: TitledText[];
  businessLines: string[];
  businessAreas: TitledText[];
  businessAreasLead: string;
  serviceLines: { title: string; text: string; items: string[] }[];
  sectors: string[];
  leadershipRoles: string[];
  expertise: {
    eyebrow: string;
    years: number;
    heading: string;
    lead: string;
    note: string;
  };
};

export type StatItem = {
  value: number;
  suffix: string;
  label: string;
  note: string;
  plain: boolean;
};

export type HomeContent = {
  meta: PageMeta;
  hero: {
    badge: string;
    titleLines: string[];
    highlight: string;
    lead: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    panelNote: string;
    panelText: string;
    dataPoints: { label: string; value: string }[];
  };
  stats: StatItem[];
  sections: {
    about: { eyebrow: string; title: string; highlight: string; ctaLabel: string };
    services: SectionIntro & { ctaLabel: string };
    solutions: SectionIntro & { ctaLabel: string; pillarsHeading: string };
    industries: SectionIntro & { ctaLabel: string };
    projects: SectionIntro & { ctaLabel: string };
    customers: { eyebrow: string; title: string; lead: string };
    partners: SectionIntro;
    why: SectionIntro;
    commitment: {
      eyebrow: string;
      titleLine1: string;
      titleLine2: string;
      highlight: string;
      outcomes: TitledText[];
    };
  };
  finalCta: {
    titleLine1: string;
    titleLine2: string;
    text: string;
    primary: Cta;
    secondary: Cta;
  };
};

export type PagesContent = {
  about: HeroCopy & PageMeta;
  services: HeroCopy &
    PageMeta & { deliveryEyebrow: string; deliveryTitle: string; deliveryHighlight: string };
  solutions: HeroCopy & PageMeta;
  industries: HeroCopy & PageMeta;
  projects: HeroCopy &
    PageMeta & {
      categories: string[];
      indexEyebrow: string;
      indexTitle: string;
      indexHighlight: string;
    };
  partners: HeroCopy &
    PageMeta & { customersEyebrow: string; customersTitle: string; customersLead: string };
  careers: HeroCopy &
    PageMeta & {
      whyEyebrow: string;
      whyHeading: string;
      rolesEyebrow: string;
      rolesHeading: string;
      noVacanciesText: string;
      applyLabel: string;
      finalCta: {
        titleLine1: string;
        titleLine2: string;
        text: string;
        primary: Cta;
        secondary: Cta;
      };
    };
  contact: HeroCopy & PageMeta & { whatsappLabel: string; whatsappNote: string };
};

export type NavigationContent = {
  primary: NavItem[];
  footer: { heading: string; items: NavItem[] }[];
  legal: NavItem[];
  footerBlurb: string;
  footerCtaHeading: string;
  footerCtaLabel: string;
};

export type ServiceContent = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string[];
  capabilities: string[];
  outcomes: string[];
  image: ImageRef;
  /** Key into `lib/content/icons.ts`. */
  icon: string;
  theme: string;
};

export type ServicesContent = { items: ServiceContent[] };

export type SolutionsContent = {
  steps: { index: string; title: string; statement: string; detail: string; points: string[] }[];
  pillars: TitledText[];
};

export type IndustryContent = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: ImageRef;
};
export type IndustriesContent = { items: IndustryContent[] };

export type ProjectContent = {
  id: string;
  group: string;
  client: string;
  clientLogo: string;
  name: string;
  sector: string;
  year: string;
  location: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  featured: boolean;
  image: ImageRef;
};
export type ProjectsContent = {
  groups: { id: string; title: string; description: string }[];
  items: ProjectContent[];
};

export type CustomerContent = {
  id: string;
  name: string;
  shortName: string;
  amharicName: string;
  logo: string;
  category: string;
  description: string;
  url: string;
};
export type CustomersContent = { items: CustomerContent[] };

export type PartnerContent = { name: string; logo: string; category: string; url: string };
export type PartnersContent = { items: PartnerContent[] };

export type WhyContent = { principles: { index: string; title: string; text: string }[] };

export type CareersContent = {
  values: TitledText[];
  openRoles: { title: string; team: string; location: string; type: string }[];
};

export type SiteContent = {
  company: CompanyContent;
  about: AboutContent;
  home: HomeContent;
  pages: PagesContent;
  navigation: NavigationContent;
  services: ServicesContent;
  solutions: SolutionsContent;
  industries: IndustriesContent;
  projects: ProjectsContent;
  customers: CustomersContent;
  partners: PartnersContent;
  why: WhyContent;
  careers: CareersContent;
};

export type SectionId = keyof SiteContent;
