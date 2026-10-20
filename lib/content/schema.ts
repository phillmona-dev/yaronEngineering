/**
 * What the "Website content" area of the admin panel can edit, and how each field should be
 * presented. The site itself never reads this file; it only drives the editor. Every field key
 * must match the shape in `lib/content/types.ts` so a saved document merges cleanly.
 */
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Compass,
  Factory,
  FolderKanban,
  Handshake,
  Home,
  Landmark,
  Layers,
  Menu,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { SERVICE_ICONS } from "./icons";
import type { SectionId } from "./types";

export type FieldSpec =
  | {
      type: "text" | "textarea" | "number" | "url" | "email";
      key: string;
      label: string;
      help?: string;
      required?: boolean;
      placeholder?: string;
      rows?: number;
    }
  | { type: "boolean"; key: string; label: string; help?: string }
  | {
      type: "select";
      key: string;
      label: string;
      help?: string;
      options: { value: string; label: string }[];
    }
  | { type: "image"; key: string; label: string; help?: string }
  | { type: "list"; key: string; label: string; help?: string; placeholder?: string }
  | { type: "group"; key: string; label: string; help?: string; fields: FieldSpec[] }
  | {
      type: "array";
      key: string;
      label: string;
      help?: string;
      fields: FieldSpec[];
      /** Key of the field whose value names each item in the list (e.g. "title"). */
      itemLabel: string;
      addLabel?: string;
    };

export type SectionSpec = {
  id: SectionId;
  title: string;
  /** One sentence shown on the overview card. */
  summary: string;
  /** A short paragraph shown at the top of the editor. */
  description: string;
  /** Where the content appears, in plain words. */
  appearsOn: string[];
  /** Public page to open after saving. */
  previewPath: string;
  icon: LucideIcon;
  fields: FieldSpec[];
};

/* ---------- Reusable building blocks ---------- */

const image = (label = "Image", help?: string, required = true): FieldSpec => ({
  type: "group",
  key: "image",
  label,
  help,
  fields: [
    {
      type: "image",
      key: "src",
      label: "Picture",
      help: "Choose from the media library or upload a new photo.",
    },
    {
      type: "text",
      key: "alt",
      label: "Alt text",
      help: "A short description of the picture for screen readers and search engines.",
      required,
    },
  ],
});

const cta = (key: string, label: string, help?: string): FieldSpec => ({
  type: "group",
  key,
  label,
  help,
  fields: [
    { type: "text", key: "label", label: "Button text", required: true },
    {
      type: "text",
      key: "href",
      label: "Link",
      help: "A page on this site (for example /contact) or a full web address.",
      required: true,
    },
  ],
});

const meta = (): FieldSpec => ({
  type: "group",
  key: "meta",
  label: "Search engine listing",
  help: "What Google and social networks show for this page.",
  fields: [
    {
      type: "text",
      key: "metaTitle",
      label: "Page title",
      help: "Keep it under 60 characters.",
      required: true,
    },
    {
      type: "textarea",
      key: "metaDescription",
      label: "Page description",
      help: "One or two sentences, ideally under 160 characters.",
      rows: 2,
      required: true,
    },
  ],
});

/** Hero + search fields for an inner page (flattened, since the page object holds them directly). */
const pageHero = (): FieldSpec[] => [
  {
    type: "text",
    key: "metaTitle",
    label: "Browser / search title",
    help: "Shown in the browser tab and in Google results.",
    required: true,
  },
  {
    type: "textarea",
    key: "metaDescription",
    label: "Search description",
    help: "One or two sentences for search engines, ideally under 160 characters.",
    rows: 2,
  },
  {
    type: "text",
    key: "eyebrow",
    label: "Small label above the title",
    help: "The short uppercase line above the headline.",
  },
  { type: "text", key: "titleLine1", label: "Headline, first line", required: true },
  { type: "text", key: "titleLine2", label: "Headline, second line", required: true },
  {
    type: "text",
    key: "highlight",
    label: "Word to colour gold",
    help: "Type a word or phrase that appears in the second line exactly as written. Leave empty for no accent.",
  },
  {
    type: "textarea",
    key: "lead",
    label: "Introduction",
    help: "The sentence or two under the headline.",
    rows: 3,
  },
];

const sectionIntro = (key: string, label: string, where: string, withCta = true): FieldSpec => ({
  type: "group",
  key,
  label,
  help: `Heading block of the ${where}.`,
  fields: [
    {
      type: "text",
      key: "eyebrow",
      label: "Small label",
      help: "Short uppercase line above the heading.",
    },
    { type: "text", key: "title", label: "Heading", required: true },
    {
      type: "text",
      key: "highlight",
      label: "Words to colour blue",
      help: "Must appear in the heading exactly as written. Leave empty for no accent.",
    },
    { type: "textarea", key: "lead", label: "Introduction", rows: 3 },
    ...(withCta ? [{ type: "text", key: "ctaLabel", label: "Button text" } as FieldSpec] : []),
  ],
});

const titledTextFields: FieldSpec[] = [
  { type: "text", key: "title", label: "Title", required: true },
  { type: "textarea", key: "text", label: "Text", rows: 3, required: true },
];

/* ---------- Sections ---------- */

export const SECTIONS: SectionSpec[] = [
  {
    id: "company",
    title: "Company & contact",
    summary: "Name, tagline, address, phone numbers, email and WhatsApp.",
    description:
      "The facts about the company that appear across the whole website: in the header and footer, on the contact page, in the AI assistant's answers and in search-engine data. Change a phone number or email here once and it updates everywhere.",
    appearsOn: [
      "Footer and mobile menu",
      "Contact page",
      "WhatsApp button",
      "AI assistant",
      "Search engines",
    ],
    previewPath: "/contact",
    icon: Building2,
    fields: [
      {
        type: "text",
        key: "name",
        label: "Company name",
        help: "Full public name, e.g. Yaron Engineering PLC.",
        required: true,
      },
      {
        type: "text",
        key: "shortName",
        label: "Short name",
        help: "Used in sentences, e.g. “Yaron Engineering delivers…”.",
        required: true,
      },
      {
        type: "text",
        key: "legalName",
        label: "Legal name",
        help: "As registered. Used in legal pages and the AI assistant.",
      },
      {
        type: "text",
        key: "tagline",
        label: "Tagline",
        help: "One line describing what the company does. Shown under the logo.",
      },
      {
        type: "text",
        key: "slogan",
        label: "Slogan",
        help: "The motto, e.g. “Innovating Infrastructure. Empowering Growth.”",
      },
      {
        type: "textarea",
        key: "description",
        label: "One-paragraph description",
        help: "Used for search engines and social sharing when a page has no description of its own.",
        rows: 3,
      },
      { type: "number", key: "founded", label: "Year founded" },
      {
        type: "text",
        key: "foundedMonth",
        label: "Month founded",
        help: "Spelled out, e.g. August.",
      },
      {
        type: "group",
        key: "headquarters",
        label: "Headquarters",
        help: "The address shown on the contact page, in the footer and on the map.",
        fields: [
          { type: "text", key: "streetAddress", label: "Street address", required: true },
          { type: "text", key: "city", label: "City", required: true },
          { type: "text", key: "country", label: "Country", required: true },
          {
            type: "text",
            key: "countryCode",
            label: "Country code",
            help: "Two letters, e.g. ET. Used for search-engine data.",
          },
          {
            type: "number",
            key: "lat",
            label: "Latitude",
            help: "Decimal degrees, used for the map pin and footer coordinates.",
          },
          { type: "number", key: "lng", label: "Longitude" },
        ],
      },
      {
        type: "group",
        key: "contact",
        label: "Contact details",
        fields: [
          { type: "email", key: "email", label: "Main email", required: true },
          { type: "email", key: "salesEmail", label: "Sales email" },
          {
            type: "list",
            key: "phones",
            label: "Phone numbers",
            help: "One per line, formatted the way they should be displayed. The first one is used first.",
            placeholder: "+251 9xx xxx xxx",
          },
          { type: "text", key: "whatsapp", label: "WhatsApp number (as displayed)" },
          {
            type: "text",
            key: "whatsappE164",
            label: "WhatsApp number (digits only)",
            help: "Country code plus number with no spaces or plus sign, e.g. 251944159690. Powers the green WhatsApp button.",
          },
          {
            type: "textarea",
            key: "whatsappGreeting",
            label: "WhatsApp opening message",
            help: "Pre-filled in the visitor's chat when they tap the WhatsApp button.",
            rows: 2,
          },
          {
            type: "text",
            key: "officeHours",
            label: "Office hours",
            help: "Shown on the contact page.",
          },
        ],
      },
      {
        type: "array",
        key: "social",
        label: "Social media links",
        help: "Shown in the footer. Leave empty to hide the social row.",
        itemLabel: "label",
        addLabel: "Add link",
        fields: [
          { type: "text", key: "label", label: "Network", help: "e.g. LinkedIn", required: true },
          { type: "url", key: "href", label: "Profile address", required: true },
        ],
      },
    ],
  },

  {
    id: "home",
    title: "Home page",
    summary: "Hero headline, key figures, every section heading and the closing call to action.",
    description:
      "Everything written on the home page. The lists themselves (services, industries, projects…) are edited in their own sections; here you control the headlines, introductions and buttons around them.",
    appearsOn: ["Home page", "Closing call-to-action on every page", "Services menu"],
    previewPath: "/",
    icon: Home,
    fields: [
      meta(),
      {
        type: "group",
        key: "hero",
        label: "Hero (top of the page)",
        fields: [
          {
            type: "text",
            key: "badge",
            label: "Small badge text",
            help: "The pill above the headline.",
          },
          {
            type: "list",
            key: "titleLines",
            label: "Headline lines",
            help: "One line per entry. Three or four short lines read best.",
          },
          {
            type: "text",
            key: "highlight",
            label: "Word to colour gold",
            help: "Must appear in one of the lines exactly as written.",
          },
          { type: "textarea", key: "lead", label: "Introduction paragraph", rows: 3 },
          cta("primaryCta", "Main button"),
          cta("secondaryCta", "Secondary button"),
          {
            type: "text",
            key: "panelNote",
            label: "Figure panel: small label",
            help: "Above the big number, e.g. “Delivered since 2018”.",
          },
          {
            type: "text",
            key: "panelText",
            label: "Figure panel: sentence",
            help: "Below the big number. The number itself is the first entry under Key figures.",
          },
          {
            type: "array",
            key: "dataPoints",
            label: "Technical data line",
            help: "The small label/value pairs at the bottom of the hero.",
            itemLabel: "label",
            fields: [
              { type: "text", key: "label", label: "Label", required: true },
              { type: "text", key: "value", label: "Value", required: true },
            ],
          },
        ],
      },
      {
        type: "array",
        key: "stats",
        label: "Key figures",
        help: "The four big numbers shown under the hero and on the About and Projects pages. The first one also appears in the hero panel.",
        itemLabel: "label",
        addLabel: "Add figure",
        fields: [
          { type: "number", key: "value", label: "Number", required: true },
          {
            type: "text",
            key: "suffix",
            label: "Suffix",
            help: "e.g. + or %. Leave empty for none.",
          },
          { type: "text", key: "label", label: "Label", required: true },
          { type: "text", key: "note", label: "Small note" },
          {
            type: "boolean",
            key: "plain",
            label: "Show as a plain number (no thousands separator)",
            help: "Turn on for years such as 2018.",
          },
        ],
      },
      {
        type: "group",
        key: "sections",
        label: "Section headings",
        help: "The heading block of each home-page section.",
        fields: [
          {
            type: "group",
            key: "about",
            label: "About block",
            fields: [
              { type: "text", key: "eyebrow", label: "Small label" },
              { type: "text", key: "title", label: "Heading", required: true },
              { type: "text", key: "highlight", label: "Words to colour blue" },
              { type: "text", key: "ctaLabel", label: "Link text" },
            ],
          },
          sectionIntro(
            "services",
            "Services block",
            "services section (also the heading inside the Services menu)",
          ),
          {
            type: "group",
            key: "solutions",
            label: "Solutions block",
            fields: [
              { type: "text", key: "eyebrow", label: "Small label" },
              { type: "text", key: "title", label: "Heading", required: true },
              { type: "text", key: "highlight", label: "Words to colour blue" },
              { type: "textarea", key: "lead", label: "Introduction", rows: 3 },
              { type: "text", key: "ctaLabel", label: "Button text" },
              {
                type: "text",
                key: "pillarsHeading",
                label: "Heading above the tailoring pillars",
                help: "Only shown on the Solutions page.",
              },
            ],
          },
          sectionIntro("industries", "Industries block", "industries section"),
          sectionIntro("projects", "Projects block", "projects section"),
          {
            type: "group",
            key: "customers",
            label: "Clients block",
            fields: [
              { type: "text", key: "eyebrow", label: "Small label" },
              {
                type: "text",
                key: "title",
                label: "Heading",
                help: "The part after the first full stop is coloured blue.",
                required: true,
              },
              { type: "textarea", key: "lead", label: "Introduction", rows: 2 },
            ],
          },
          sectionIntro("partners", "Partners block", "partners section", false),
          sectionIntro("why", "Why Yaron block", "“why choose us” section", false),
          {
            type: "group",
            key: "commitment",
            label: "Commitment block",
            fields: [
              { type: "text", key: "eyebrow", label: "Small label" },
              { type: "text", key: "titleLine1", label: "Heading, first line", required: true },
              { type: "text", key: "titleLine2", label: "Heading, second line", required: true },
              {
                type: "text",
                key: "highlight",
                label: "Words to colour blue",
                help: "Must appear in the second line.",
              },
              {
                type: "array",
                key: "outcomes",
                label: "Three outcomes",
                itemLabel: "title",
                fields: titledTextFields,
              },
            ],
          },
        ],
      },
      {
        type: "group",
        key: "finalCta",
        label: "Closing call to action",
        help: "The big blue block at the bottom of most pages.",
        fields: [
          { type: "text", key: "titleLine1", label: "Heading, first line", required: true },
          { type: "text", key: "titleLine2", label: "Heading, second line (gold)", required: true },
          { type: "textarea", key: "text", label: "Text", rows: 2 },
          cta("primary", "Main button"),
          cta("secondary", "Secondary button"),
        ],
      },
    ],
  },

  {
    id: "about",
    title: "About the company",
    summary: "Vision, mission, story, core values, business areas and delivery model.",
    description:
      "The longer-form text about the company: the story, vision and mission, core values, main business areas, the three service lines and the team expertise block.",
    appearsOn: [
      "About page",
      "Home page (about, expertise and commitment blocks)",
      "Services page (how we deliver)",
      "AI assistant",
    ],
    previewPath: "/about",
    icon: Landmark,
    fields: [
      {
        type: "text",
        key: "storyHeading",
        label: "Story heading",
        help: "Heading next to the story paragraphs on the About page.",
      },
      {
        type: "list",
        key: "story",
        label: "Story paragraphs",
        help: "One paragraph per entry. The first is shown larger.",
      },
      { type: "textarea", key: "vision", label: "Vision statement", rows: 4, required: true },
      { type: "textarea", key: "mission", label: "Mission statement", rows: 3, required: true },
      {
        type: "array",
        key: "coreValues",
        label: "Core values",
        itemLabel: "title",
        addLabel: "Add value",
        fields: titledTextFields,
      },
      {
        type: "list",
        key: "commitment",
        label: "Commitment paragraphs",
        help: "Shown beside the “Our commitment” heading.",
      },
      {
        type: "list",
        key: "sectors",
        label: "Sectors served",
        help: "Short labels shown as a row under the story (e.g. Government institutions).",
      },
      {
        type: "textarea",
        key: "businessAreasLead",
        label: "Business areas introduction",
        help: "Paragraph beside the slogan on the About page.",
        rows: 3,
      },
      {
        type: "array",
        key: "businessAreas",
        label: "Main business areas",
        itemLabel: "title",
        addLabel: "Add business area",
        fields: titledTextFields,
      },
      {
        type: "list",
        key: "businessLines",
        label: "Business lines",
        help: "Short list used by the AI assistant.",
      },
      {
        type: "array",
        key: "serviceLines",
        label: "How we deliver (three service lines)",
        help: "The three columns on the Services page: consultancy, system integration, supply.",
        itemLabel: "title",
        addLabel: "Add service line",
        fields: [...titledTextFields, { type: "list", key: "items", label: "Bullet points" }],
      },
      {
        type: "group",
        key: "expertise",
        label: "Experience & expertise block",
        fields: [
          { type: "text", key: "eyebrow", label: "Small label" },
          { type: "number", key: "years", label: "Years of experience (big number)" },
          { type: "text", key: "heading", label: "Heading", required: true },
          { type: "textarea", key: "lead", label: "Introduction", rows: 3 },
          { type: "textarea", key: "note", label: "Note beside the photo", rows: 2 },
        ],
      },
      {
        type: "list",
        key: "leadershipRoles",
        label: "Leadership roles",
        help: "Listed in the expertise block.",
      },
    ],
  },

  {
    id: "services",
    title: "Services",
    summary: "The seven services: titles, descriptions, capabilities, outcomes, photos and icons.",
    description:
      "Each service has its own page (/services/<address>) and appears in the services menu, on the home page and on the Services page. Drag the order with the arrows; the first item is shown first everywhere.",
    appearsOn: [
      "Services page",
      "Each service's own page",
      "Home page services block",
      "Services menu",
      "AI assistant",
    ],
    previewPath: "/services",
    icon: Layers,
    fields: [
      {
        type: "array",
        key: "items",
        label: "Services",
        itemLabel: "title",
        addLabel: "Add service",
        fields: [
          { type: "text", key: "title", label: "Full title", required: true },
          {
            type: "text",
            key: "shortTitle",
            label: "Short title",
            help: "Used in menus and buttons.",
            required: true,
          },
          {
            type: "text",
            key: "slug",
            label: "Page address",
            help: "Lowercase letters and hyphens only, e.g. cloud-services. Changing it changes the page's web address.",
            required: true,
          },
          { type: "text", key: "index", label: "Number", help: "Two digits, e.g. 03." },
          {
            type: "text",
            key: "theme",
            label: "Theme label",
            help: "Short category shown in the hero, e.g. Security operations.",
          },
          {
            type: "select",
            key: "icon",
            label: "Icon",
            options: Object.entries(SERVICE_ICONS).map(([value, v]) => ({ value, label: v.label })),
          },
          {
            type: "textarea",
            key: "summary",
            label: "Summary",
            help: "One or two sentences shown in lists.",
            rows: 2,
            required: true,
          },
          {
            type: "list",
            key: "description",
            label: "Description paragraphs",
            help: "Shown on the service's own page.",
          },
          {
            type: "list",
            key: "capabilities",
            label: "Capabilities",
            help: "Short tags, e.g. LAN / WAN & SD-WAN.",
          },
          {
            type: "list",
            key: "outcomes",
            label: "What the client gets",
            help: "Three short outcome statements.",
          },
          image("Photo"),
        ],
      },
    ],
  },

  {
    id: "solutions",
    title: "Solutions & method",
    summary: "The six-step method and the six tailoring pillars.",
    description:
      "The “Technology built around your mission” method shown on the home, Solutions and Services pages, plus the pillars every solution is tailored to.",
    appearsOn: ["Solutions page", "Home page", "Services page"],
    previewPath: "/solutions",
    icon: Compass,
    fields: [
      {
        type: "array",
        key: "steps",
        label: "Method steps",
        itemLabel: "title",
        addLabel: "Add step",
        fields: [
          { type: "text", key: "index", label: "Number", help: "Two digits, e.g. 01." },
          { type: "text", key: "title", label: "Step name", required: true },
          { type: "text", key: "statement", label: "One-line statement", required: true },
          { type: "textarea", key: "detail", label: "Detail", rows: 3 },
          { type: "list", key: "points", label: "Key points", help: "Three short phrases." },
        ],
      },
      {
        type: "array",
        key: "pillars",
        label: "Tailoring pillars",
        help: "Shown on the Solutions page under “Every solution is tailored to”.",
        itemLabel: "title",
        addLabel: "Add pillar",
        fields: titledTextFields,
      },
    ],
  },

  {
    id: "industries",
    title: "Industries",
    summary: "The sectors served, each with a summary, description and photo.",
    description:
      "The industry cards on the home page and the detailed list on the Industries page. Each industry needs a photo; it is shown tinted in the brand blue.",
    appearsOn: ["Industries page", "Home page industries block"],
    previewPath: "/industries",
    icon: Factory,
    fields: [
      {
        type: "array",
        key: "items",
        label: "Industries",
        itemLabel: "title",
        addLabel: "Add industry",
        fields: [
          { type: "text", key: "title", label: "Name", required: true },
          {
            type: "text",
            key: "slug",
            label: "Anchor",
            help: "Lowercase letters and hyphens, e.g. banking. Used in the page address.",
            required: true,
          },
          { type: "text", key: "summary", label: "One-line summary", required: true },
          { type: "textarea", key: "description", label: "Description", rows: 3 },
          image("Photo"),
        ],
      },
    ],
  },

  {
    id: "projects",
    title: "Projects & references",
    summary: "Project groups and the full list of delivered projects.",
    description:
      "Every project reference on the Projects page, grouped by service line. Turn on “Featured” and add a photo to show a project with the large editorial card on the home page. Never publish contract values or client contact persons.",
    appearsOn: ["Projects page", "Home page projects block", "AI assistant"],
    previewPath: "/projects",
    icon: FolderKanban,
    fields: [
      {
        type: "array",
        key: "groups",
        label: "Project groups",
        help: "The headings the project index is grouped under. Each project picks one by its code.",
        itemLabel: "title",
        addLabel: "Add group",
        fields: [
          {
            type: "text",
            key: "id",
            label: "Code",
            help: "Short lowercase code used by projects, e.g. consultancy.",
            required: true,
          },
          { type: "text", key: "title", label: "Group title", required: true },
          { type: "textarea", key: "description", label: "Description", rows: 2 },
        ],
      },
      {
        type: "array",
        key: "items",
        label: "Projects",
        itemLabel: "name",
        addLabel: "Add project",
        fields: [
          { type: "text", key: "name", label: "Project name", required: true },
          { type: "text", key: "client", label: "Client", required: true },
          {
            type: "text",
            key: "id",
            label: "Code",
            help: "Unique lowercase code, e.g. awash-it-governance.",
            required: true,
          },
          {
            type: "text",
            key: "group",
            label: "Group code",
            help: "Must match one of the project group codes above.",
            required: true,
          },
          {
            type: "text",
            key: "sector",
            label: "Sector",
            help: "e.g. Banking & Financial Services",
          },
          { type: "text", key: "year", label: "Period", help: "e.g. 2020 – 2024" },
          { type: "text", key: "location", label: "Location" },
          { type: "textarea", key: "summary", label: "Scope summary", rows: 3, required: true },
          {
            type: "list",
            key: "highlights",
            label: "Scale indicators",
            help: "Quantities only, e.g. 769 IP cameras across 24 sites.",
          },
          { type: "list", key: "technologies", label: "Technology tags" },
          {
            type: "image",
            key: "clientLogo",
            label: "Client logo",
            help: "Optional. Transparent PNG works best.",
          },
          {
            type: "boolean",
            key: "featured",
            label: "Featured project",
            help: "Featured projects get the large card on the home page and need a photo.",
          },
          image("Photo (featured projects only)", undefined, false),
        ],
      },
    ],
  },

  {
    id: "customers",
    title: "Clients",
    summary: "Client institutions with logos, categories and links.",
    description:
      "The client cards shown on the home page and the Partners page. The first six clients that have both a logo and a website also appear in the “Trusted by” row of the hero.",
    appearsOn: ["Home page clients block and hero", "Partners page"],
    previewPath: "/partners",
    icon: Users,
    fields: [
      {
        type: "array",
        key: "items",
        label: "Clients",
        itemLabel: "name",
        addLabel: "Add client",
        fields: [
          { type: "text", key: "name", label: "Name", required: true },
          {
            type: "text",
            key: "id",
            label: "Code",
            help: "Unique lowercase code, e.g. awash-bank.",
            required: true,
          },
          {
            type: "text",
            key: "shortName",
            label: "Short name",
            help: "Shown instead of a logo when none is set.",
          },
          { type: "text", key: "amharicName", label: "Amharic name" },
          {
            type: "text",
            key: "category",
            label: "Category",
            help: "e.g. Government & Judiciary",
            required: true,
          },
          { type: "textarea", key: "description", label: "What was delivered", rows: 2 },
          {
            type: "image",
            key: "logo",
            label: "Logo",
            help: "Transparent PNG, roughly 120px tall.",
          },
          {
            type: "url",
            key: "url",
            label: "Official website",
            help: "Optional. Only add it when verified.",
          },
        ],
      },
    ],
  },

  {
    id: "partners",
    title: "Technology partners",
    summary: "Vendor partners shown in the logo marquee and the partners grid.",
    description:
      "Technology vendors the company partners with. Partners with a logo appear in the scrolling logo strip; all of them appear in the grid on the Partners page.",
    appearsOn: ["Partners page", "Home page partners block", "AI assistant"],
    previewPath: "/partners",
    icon: Handshake,
    fields: [
      {
        type: "array",
        key: "items",
        label: "Partners",
        itemLabel: "name",
        addLabel: "Add partner",
        fields: [
          { type: "text", key: "name", label: "Name", required: true },
          {
            type: "text",
            key: "category",
            label: "Specialty",
            help: "e.g. Network security",
            required: true,
          },
          {
            type: "image",
            key: "logo",
            label: "Logo",
            help: "Transparent PNG, roughly 120px tall.",
          },
          { type: "url", key: "url", label: "Website" },
        ],
      },
    ],
  },

  {
    id: "why",
    title: "Why choose us",
    summary: "The six principles in the “Why organizations choose Yaron” block.",
    description: "The numbered principles shown on the home page and the Partners page.",
    appearsOn: ["Home page", "Partners page"],
    previewPath: "/",
    icon: Star,
    fields: [
      {
        type: "array",
        key: "principles",
        label: "Principles",
        itemLabel: "title",
        addLabel: "Add principle",
        fields: [
          { type: "text", key: "index", label: "Number", help: "Two digits, e.g. 04." },
          ...titledTextFields,
        ],
      },
    ],
  },

  {
    id: "careers",
    title: "Careers",
    summary: "Reasons to join and the list of open roles.",
    description:
      "The Careers page content. Add open roles here when you are hiring; when the list is empty the page invites speculative applications instead.",
    appearsOn: ["Careers page"],
    previewPath: "/careers",
    icon: Briefcase,
    fields: [
      {
        type: "array",
        key: "values",
        label: "Why join",
        itemLabel: "title",
        addLabel: "Add reason",
        fields: titledTextFields,
      },
      {
        type: "array",
        key: "openRoles",
        label: "Open roles",
        help: "Leave empty when there are no vacancies.",
        itemLabel: "title",
        addLabel: "Add role",
        fields: [
          { type: "text", key: "title", label: "Job title", required: true },
          { type: "text", key: "team", label: "Team", help: "e.g. Network engineering" },
          { type: "text", key: "location", label: "Location", help: "e.g. Addis Ababa" },
          { type: "text", key: "type", label: "Type", help: "e.g. Full-time" },
        ],
      },
    ],
  },

  {
    id: "pages",
    title: "Page headers",
    summary: "Headline, introduction, photo and search listing of each inner page.",
    description:
      "The top section of every inner page: the small label, the two-line headline with its gold word, the introduction, the background photo and what search engines show. A few pages also have extra headings listed under them.",
    appearsOn: [
      "About, Services, Solutions, Industries, Projects, Partners, Careers and Contact pages",
    ],
    previewPath: "/about",
    icon: Sparkles,
    fields: [
      { type: "group", key: "about", label: "About page", fields: pageHero() },
      {
        type: "group",
        key: "services",
        label: "Services page",
        fields: [
          ...pageHero(),
          { type: "text", key: "deliveryEyebrow", label: "“How we deliver” small label" },
          { type: "text", key: "deliveryTitle", label: "“How we deliver” heading" },
          { type: "text", key: "deliveryHighlight", label: "Words to colour blue in that heading" },
        ],
      },
      { type: "group", key: "solutions", label: "Solutions page", fields: pageHero() },
      { type: "group", key: "industries", label: "Industries page", fields: pageHero() },
      {
        type: "group",
        key: "projects",
        label: "Projects page",
        fields: [
          ...pageHero(),
          { type: "list", key: "categories", label: "Category tags under the headline" },
          { type: "text", key: "indexEyebrow", label: "Project index small label" },
          { type: "text", key: "indexTitle", label: "Project index heading" },
          { type: "text", key: "indexHighlight", label: "Words to colour blue in that heading" },
        ],
      },
      {
        type: "group",
        key: "partners",
        label: "Partners page",
        fields: [
          ...pageHero(),
          { type: "text", key: "customersEyebrow", label: "Clients block small label" },
          {
            type: "text",
            key: "customersTitle",
            label: "Clients block heading",
            help: "The part after the first full stop is coloured blue.",
          },
          { type: "textarea", key: "customersLead", label: "Clients block introduction", rows: 2 },
        ],
      },
      {
        type: "group",
        key: "careers",
        label: "Careers page",
        fields: [
          ...pageHero(),
          { type: "text", key: "whyEyebrow", label: "“Why join” small label" },
          { type: "text", key: "whyHeading", label: "“Why join” heading" },
          { type: "text", key: "rolesEyebrow", label: "Open roles small label" },
          { type: "text", key: "rolesHeading", label: "Open roles heading" },
          {
            type: "textarea",
            key: "noVacanciesText",
            label: "Text shown when there are no vacancies",
            rows: 3,
          },
          { type: "text", key: "applyLabel", label: "Speculative application button text" },
          {
            type: "group",
            key: "finalCta",
            label: "Closing call to action (careers version)",
            fields: [
              { type: "text", key: "titleLine1", label: "Heading, first line" },
              { type: "text", key: "titleLine2", label: "Heading, second line (gold)" },
              { type: "textarea", key: "text", label: "Text", rows: 2 },
              cta("primary", "Main button"),
              cta("secondary", "Secondary button"),
            ],
          },
        ],
      },
      {
        type: "group",
        key: "contact",
        label: "Contact page",
        fields: [
          ...pageHero(),
          { type: "text", key: "whatsappLabel", label: "WhatsApp button text" },
          {
            type: "text",
            key: "whatsappNote",
            label: "Note under the WhatsApp button",
            help: "Shown after the number, e.g. “replies during office hours”.",
          },
        ],
      },
    ],
  },

  {
    id: "navigation",
    title: "Menus & footer",
    summary: "Top navigation, footer link columns, legal links and footer text.",
    description:
      "The links in the top navigation bar and mobile menu, the link columns in the footer, the legal links and the short company blurb in the footer. Links are pages on this site, e.g. /services.",
    appearsOn: ["Header on every page", "Mobile menu", "Footer on every page"],
    previewPath: "/",
    icon: Menu,
    fields: [
      {
        type: "array",
        key: "primary",
        label: "Top navigation",
        help: "Keep it to about seven items so it fits on one line.",
        itemLabel: "label",
        addLabel: "Add menu item",
        fields: [
          { type: "text", key: "label", label: "Text", required: true },
          { type: "text", key: "href", label: "Link", help: "e.g. /services", required: true },
        ],
      },
      {
        type: "array",
        key: "footer",
        label: "Footer link columns",
        itemLabel: "heading",
        addLabel: "Add column",
        fields: [
          { type: "text", key: "heading", label: "Column heading", required: true },
          {
            type: "array",
            key: "items",
            label: "Links",
            itemLabel: "label",
            addLabel: "Add link",
            fields: [
              { type: "text", key: "label", label: "Text", required: true },
              { type: "text", key: "href", label: "Link", required: true },
            ],
          },
        ],
      },
      {
        type: "array",
        key: "legal",
        label: "Legal links",
        help: "Shown in the bottom line of the footer.",
        itemLabel: "label",
        addLabel: "Add link",
        fields: [
          { type: "text", key: "label", label: "Text", required: true },
          { type: "text", key: "href", label: "Link", required: true },
        ],
      },
      { type: "textarea", key: "footerBlurb", label: "Footer company blurb", rows: 3 },
      {
        type: "text",
        key: "footerCtaHeading",
        label: "Footer call-to-action heading",
        help: "e.g. Start a project",
      },
      {
        type: "text",
        key: "footerCtaLabel",
        label: "Footer call-to-action link text",
        help: "e.g. Talk to our engineers",
      },
    ],
  },
];

export function getSection(id: string): SectionSpec | undefined {
  return SECTIONS.find((s) => s.id === id);
}
