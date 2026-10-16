/**
 * Project references. Client names and scopes below are published on the company's own
 * legacy website. No metrics, values or locations beyond what is published are included.
 * Fields marked `placeholder: true` are awaiting verified information.
 */
export type Project = {
  id: string;
  index: string;
  client: string;
  sector: string;
  category: string;
  scope: string;
  technologies: string[];
  /** Result is intentionally a placeholder until verified outcomes are supplied. */
  result?: string;
  location: string;
  image: { src: string; alt: string };
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    id: "awash-bank",
    index: "01",
    client: "Awash Bank",
    sector: "Banking & Financial Services",
    category: "Data Center, Network & Security",
    scope:
      "Data center, network and security, computing and storage, and information security and governance consultancy.",
    technologies: ["Data center", "Network & security", "Compute & storage", "IS governance"],
    location: "Ethiopia",
    image: { src: "/images/photos/rack-mono.jpg", alt: "Server rack with cabling, monochrome" },
  },
  {
    id: "esl",
    index: "02",
    client: "Ethiopian Shipping & Logistics Services Enterprise",
    sector: "Enterprise",
    category: "Infrastructure Consultancy",
    scope: "Data center, network and security, and computing and storage consultancy services.",
    technologies: ["Data center", "Network & security", "Compute & storage"],
    location: "Ethiopia",
    image: {
      src: "/images/photos/network-switch.jpg",
      alt: "Enterprise network switch with patch cables",
    },
  },
  {
    id: "aa-culture-tourism",
    index: "03",
    client: "Addis Ababa Culture, Art and Tourism Bureau",
    sector: "Government",
    category: "HQ Network, Security & Surveillance",
    scope:
      "Headquarters network and security project — design and implementation of network and security, CCTV and digital signage systems.",
    technologies: ["Enterprise network", "Security", "CCTV", "Digital signage"],
    location: "Addis Ababa, Ethiopia",
    image: { src: "/images/photos/cctv-wall.jpg", alt: "Surveillance cameras arranged on a wall" },
  },
  {
    id: "lion-insurance",
    index: "04",
    client: "Lion Insurance Company",
    sector: "Insurance",
    category: "Cybersecurity Deployment",
    scope: "Firewall supply, installation, configuration and training.",
    technologies: ["Next-generation firewall", "Configuration", "Training"],
    location: "Ethiopia",
    image: {
      src: "/images/photos/code-hands.jpg",
      alt: "Hands working at a laptop in a dark room",
    },
  },
  {
    id: "rammis-bank",
    index: "05",
    client: "Rammis Bank",
    sector: "Banking & Financial Services",
    category: "Cloud & Collaboration",
    scope:
      "Supply, installation, configuration and training for Microsoft 365 — email, Teams, OneDrive and Office applications.",
    technologies: ["Microsoft 365", "Exchange Online", "Teams", "OneDrive"],
    location: "Ethiopia",
    image: { src: "/images/photos/cloud-waves.jpg", alt: "Abstract flowing blue surfaces" },
  },
  {
    id: "debre-tabor-university",
    index: "06",
    client: "Debre Tabor University",
    sector: "Education",
    category: "IP Video Surveillance",
    scope: "CCTV project design and supervision — IP video surveillance system.",
    technologies: ["IP video surveillance", "Design", "Supervision"],
    location: "Debre Tabor, Ethiopia",
    image: { src: "/images/photos/university.jpg", alt: "University campus building" },
  },
];

/** Categories used for the home page showcase and filters. */
export const projectCategories = [
  "Enterprise Network Infrastructure",
  "Data Center Infrastructure",
  "Cybersecurity Deployment",
  "Cloud & Business Continuity",
] as const;
