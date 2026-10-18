/**
 * Project references. Source: Yaron Engineering PLC Company Profile (updated August 2026).
 * Published fields are limited to client, project name, period, a high-level scope and scale
 * indicators (quantities only). Contract values, client contact persons and staffing figures
 * from the profile are intentionally never published.
 */
export type ProjectGroupId = "consultancy" | "integration" | "cloud";

export type Project = {
  id: string;
  group: ProjectGroupId;
  client: string;
  clientLogo?: string;
  name: string;
  sector: string;
  /** Period as stated in the company profile, e.g. "2020 – 2024". */
  year?: string;
  location: string;
  summary: string;
  /** Scale indicators — quantities and key systems only, never contract values. */
  highlights: string[];
  technologies: string[];
  /** Featured projects get the large editorial card and need an image. */
  featured?: { image: { src: string; alt: string } };
};

export const projectGroups: { id: ProjectGroupId; title: string; description: string }[] = [
  {
    id: "consultancy",
    title: "ICT Infrastructure & Cyber Security Consultancy",
    description:
      "Independent design, supervision, testing and commissioning for data centers, networks, security, computing and governance programmes.",
  },
  {
    id: "integration",
    title: "ICT & Cyber Security Supply and System Integration",
    description:
      "Supply, installation, configuration and training for networks, data centers, surveillance, firewalls and enterprise compute.",
  },
  {
    id: "cloud",
    title: "Software & Cloud Services",
    description:
      "Microsoft 365, Exchange Online, Windows and cloud business applications — supplied, integrated and supported.",
  },
];

export const projects: Project[] = [
  // ── ICT Infrastructure & Cyber Security Consultancy ──────────────────────
  {
    id: "federal-supreme-court",
    group: "consultancy",
    client: "Federal Supreme Court",
    clientLogo: "/images/customers/federal-supreme-court.png",
    name: "Data Center, LAN & WAN Network Infrastructure Consultancy",
    sector: "Government & Judiciary",
    year: "2020 – 2024",
    location: "Ethiopia",
    summary:
      "Consultancy for the main and disaster-recovery data centers, server rooms, LAN and WAN infrastructure, network security and management, CCTV, and data center computing, storage, virtualization and backup systems.",
    highlights: [
      "Main + DR data centers",
      "Server rooms at 22 sites",
      "Structured cabling for 24 sites",
      "769 IP cameras across 24 sites",
    ],
    technologies: [
      "Data center facility",
      "LAN / WAN",
      "Network security",
      "CCTV",
      "Compute & storage",
      "Backup & replication",
    ],
    featured: {
      image: {
        src: "/images/photos/hero-datacenter.jpg",
        alt: "Data center corridor with illuminated server racks",
      },
    },
  },
  {
    id: "esl-dc-relocation",
    group: "consultancy",
    client: "Ethiopian Shipping and Logistics Services Enterprise",
    clientLogo: "/images/customers/esl.png",
    name: "ESL Data Center Relocation & Migration",
    sector: "State Enterprise & Logistics",
    year: "2026",
    location: "Ethiopia",
    summary:
      "Staged server room establishment, rebuilding and relocation of the data center facility, and migration of the existing data center network, security and HCI-based computing and storage.",
    highlights: ["Staged server room", "Facility rebuild & relocation", "HCI platform migration"],
    technologies: ["Data center facility", "Network & security", "HCI compute & storage"],
    featured: {
      image: {
        src: "/images/photos/network-switch.jpg",
        alt: "Enterprise network switch with patch cables",
      },
    },
  },
  {
    id: "awash-it-governance",
    group: "consultancy",
    client: "Awash Bank",
    clientLogo: "/images/customers/awash-bank.png",
    name: "IT Governance & Security Management Project Management",
    sector: "Banking & Financial Services",
    year: "2021 – 2022",
    location: "Ethiopia",
    summary:
      "Project management for the bank's IT governance and security management programme, alongside enterprise network, data center network and SD-WAN architectural design.",
    highlights: ["COBIT IT governance", "ISO 20000 & ITIL 4 ITSM", "ISO 27001 security management"],
    technologies: ["IT governance", "ITSM", "ISMS", "SD-WAN architecture"],
    featured: {
      image: { src: "/images/photos/rack-mono.jpg", alt: "Server rack with cabling, monochrome" },
    },
  },
  {
    id: "pehaa-national-data-repository",
    group: "consultancy",
    client: "Public Enterprises Holding and Administration Agency (PEHAA)",
    clientLogo: "/images/customers/pehaa.png",
    name: "National Data Repository Consultancy",
    sector: "Government",
    year: "2021 – 2023",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Consultancy for the National Data Repository application and infrastructure — data center facility, network and security including CCTV for the HQ building, computing and storage, and digital culture and training.",
    highlights: [
      "National data repository",
      "HQ network, security & CCTV",
      "Digital culture & training",
    ],
    technologies: ["Data center facility", "Network & security", "Compute & storage", "Training"],
  },
  {
    id: "esl-data-center",
    group: "consultancy",
    client: "Ethiopian Shipping and Logistics Services Enterprise",
    clientLogo: "/images/customers/esl.png",
    name: "ESL Data Center Project",
    sector: "State Enterprise & Logistics",
    year: "2018 – 2023",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Delivered as part of a consortium: data center systems design and consultancy covering the facility, network and security, HCI-based computing and storage, building cabling and CCTV.",
    highlights: ["3B+G+19 building cabling design", "HCI compute & storage", "CCTV systems"],
    technologies: [
      "Data center facility",
      "Network & security",
      "HCI",
      "Structured cabling",
      "CCTV",
    ],
  },
  {
    id: "ofag-testing-commissioning",
    group: "consultancy",
    client: "Office of the Federal Auditor General (OFAG)",
    clientLogo: "/images/customers/ofag.png",
    name: "Data Center Testing & Commissioning",
    sector: "Government",
    year: "2018 – 2019",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Testing and commissioning of the data center facility, data center network and security, computing and storage and WLAN network under a DFID-sponsored programme.",
    highlights: ["DFID-sponsored programme", "Testing & commissioning"],
    technologies: ["Data center facility", "Network & security", "Compute & storage", "WLAN"],
  },
  {
    id: "coopbank-oromia",
    group: "consultancy",
    client: "Cooperative Bank of Oromia",
    clientLogo: "/images/customers/coopbank-oromia.png",
    name: "Data Center Consultancy",
    sector: "Banking & Financial Services",
    year: "2019",
    location: "Bole, Addis Ababa, Ethiopia",
    summary:
      "Data center consultancy for the bank's transitional building — decoration, power, HVAC, modular aisle containment, cabling, access control and surveillance, fire detection and suppression and DCIM — plus migration to the new data center.",
    highlights: [
      "Modular aisle containment",
      "ATS, UPS & generator power",
      "Data center migration",
    ],
    technologies: ["Power systems", "HVAC", "Fire suppression", "Access control & CCTV", "DCIM"],
  },
  {
    id: "awash-network-security-design",
    group: "consultancy",
    client: "Awash Bank",
    clientLogo: "/images/customers/awash-bank.png",
    name: "End-to-End Enterprise Network & Security Design",
    sector: "Banking & Financial Services",
    year: "2018",
    location: "Ethiopia",
    summary:
      "Data center facility audit and redesign, data center and building network design, computing and storage redesign, security system audit and redesign, and structured cabling redesign.",
    highlights: [
      "Facility audit & redesign",
      "Security audit & redesign",
      "Data center network design",
    ],
    technologies: ["Data center facility", "Network design", "Security", "Compute & storage"],
  },
  {
    id: "decsi-data-center",
    group: "consultancy",
    client: "Dedebit Credit and Saving Institution (DECSI)",
    clientLogo: "/images/customers/decsi.png",
    name: "DECSI Data Center Project",
    sector: "Microfinance",
    year: "2018",
    location: "Mekelle, Ethiopia",
    summary:
      "Delivered as part of a consortium: design and consultancy for the data center facility, network and security, computing and storage, information security, governance and training, and core banking testing and conformance.",
    highlights: ["Core banking testing & conformance", "Information security & governance"],
    technologies: [
      "Data center facility",
      "Network & security",
      "Compute & storage",
      "IS governance",
    ],
  },
  {
    id: "interdist-sales-office",
    group: "consultancy",
    client: "Interdist Alliances Ltd (UK)",
    clientLogo: "/images/customers/interdist.png",
    name: "Ethiopia Sales Management Office",
    sector: "Technology Distribution",
    year: "2018 – 2019",
    location: "Ethiopia",
    summary:
      "Independent consultant managing the Ethiopian sales office for the supply and distribution of enterprise vendor products.",
    highlights: ["Cisco", "Oracle", "NetApp", "IBM"],
    technologies: ["Channel management", "Supply & distribution"],
  },

  // ── ICT & Cyber Security Supply and System Integration ───────────────────
  {
    id: "vora-addis-hotel",
    group: "integration",
    client: "Vora Addis Hotel",
    clientLogo: "/images/customers/vora-addis-hotel.png",
    name: "Hotel Network, CCTV, Telephone, Access Control & IPTV Systems",
    sector: "Hospitality",
    year: "2026",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, installation, configuration and training for the hotel's structured cabling, server room power, LAN switching, wireless network, IP CCTV, IP telephony, IPTV, door-lock access control and elevator control.",
    highlights: ["UTP & fiber cabling", "IP telephony & IPTV", "Door-lock & elevator control"],
    technologies: ["LAN / WLAN", "IP CCTV", "IP telephony", "IPTV", "Access control"],
    featured: {
      image: {
        src: "/images/photos/network-patch.jpg",
        alt: "Patch panel with structured network cabling",
      },
    },
  },
  {
    id: "jimma-airport",
    group: "integration",
    client: "Ethiopian Airlines",
    clientLogo: "/images/customers/ethiopian-airlines.png",
    name: "Jimma Airport Network, IP CCTV & Fire Alarm Systems",
    sector: "Aviation",
    year: "2026",
    location: "Jimma, Ethiopia",
    summary:
      "Supply, installation, configuration and training for network infrastructure, fiber splicing and testing, server room power, fire alarm systems and IP video surveillance with a monitoring video wall.",
    highlights: ["32 IP cameras", "32-channel NVR", "2 × 55″ video wall"],
    technologies: ["Structured cabling", "Network switching", "Fire alarm", "IP CCTV"],
  },
  {
    id: "lideta-modular-data-center",
    group: "integration",
    client: "City Government of Addis Ababa — Lideta Sub City",
    clientLogo: "/images/customers/addis-ababa-city.png",
    name: "HQ Modular Data Center & CCTV Systems",
    sector: "Government",
    year: "2025",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Huawei FusionModule800 modular data center with power distribution, access control and fire suppression, plus a HikCentral Pro IP video surveillance system with SAN storage and video wall — including civil works and training.",
    highlights: [
      "6-rack modular data center",
      "2 × 20 kVA UPS, 3 in-row cooling",
      "84 IP cameras, 128-channel NVR",
      "96 TB hybrid SAN",
    ],
    technologies: ["Huawei FusionModule800", "Fire suppression", "HikCentral Pro", "Video wall"],
    featured: {
      image: {
        src: "/images/photos/cctv-wall.jpg",
        alt: "Surveillance cameras arranged on a wall",
      },
    },
  },
  {
    id: "decsi-servers-storage",
    group: "integration",
    client: "Dedebit Credit and Saving Institution (DECSI)",
    clientLogo: "/images/customers/decsi.png",
    name: "Data Center Servers, Storage & Virtualization",
    sector: "Microfinance",
    year: "2025",
    location: "Mekelle, Ethiopia",
    summary:
      "Installation, configuration, testing, commissioning and training for HPE servers and storage, disk and tape backup, VMware virtualization, Veeam, Red Hat and Microsoft platforms, F5 web application firewalls and Microsoft 365.",
    highlights: [
      "6 × HPE DL360 Gen11 servers",
      "HPE Alletra MP storage",
      "60 virtual machines",
      "Microsoft 365 for 300 users",
    ],
    technologies: ["HPE", "VMware", "Veeam", "Red Hat Enterprise Linux", "F5 WAF", "Microsoft"],
  },
  {
    id: "fana-sacco",
    group: "integration",
    client: "Fana Youth Saving and Credit Cooperative",
    name: "Data Center & Network Systems",
    sector: "Microfinance",
    year: "2025",
    location: "Mekelle, Ethiopia",
    summary:
      "Supply, installation, configuration and training for a micro data center, core and access networking, servers with KVM virtualization and firewall systems.",
    highlights: [
      "Vertiv micro data center, 3 racks",
      "In-row cooling",
      "Cisco core & access switching",
    ],
    technologies: ["Vertiv", "Cisco", "Lenovo", "KVM", "Firewall"],
  },
  {
    id: "united-beverages-fortigate",
    group: "integration",
    client: "United Beverages S.C.",
    name: "FortiGate Firewalls",
    sector: "Manufacturing",
    year: "2025",
    location: "Addis Ababa, Ethiopia",
    summary: "Supply of next-generation FortiGate firewalls.",
    highlights: ["1 × FortiGate 91G", "2 × FortiGate 121G"],
    technologies: ["Fortinet", "Next-generation firewall"],
  },
  {
    id: "ozel-furniture",
    group: "integration",
    client: "Ozel Furniture Factory",
    name: "Factory CCTV System",
    sector: "Manufacturing",
    year: "2024",
    location: "Sheger City, Oromia, Ethiopia",
    summary:
      "Design, implementation and project management of an IP video surveillance system for a factory of over 1,000 m², with training and one year of support.",
    highlights: ["32 IP cameras", "64-channel NVR", "1-year support"],
    technologies: ["IP video surveillance", "Design", "Training"],
  },
  {
    id: "aa-culture-tourism",
    group: "integration",
    client: "Addis Ababa Culture, Art and Tourism Bureau",
    clientLogo: "/images/customers/aa-culture-tourism.png",
    name: "HQ Network & Security Project",
    sector: "Government",
    year: "2023 – 2024",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Design, supervision and project management for the headquarters network and security, servers, IP video surveillance, video wall, digital signage and name display systems.",
    highlights: [
      "3,000-node structured cabling",
      "65 access, 2 distribution & 1 core switch",
      "134 IP cameras",
      "2 × 3 × 3 video wall",
    ],
    technologies: ["Enterprise network", "Firewall", "Dell PowerEdge", "CCTV", "Digital signage"],
    featured: {
      image: {
        src: "/images/photos/network-red.jpg",
        alt: "Dense red patch cabling in a network rack",
      },
    },
  },
  {
    id: "debre-tabor-university",
    group: "integration",
    client: "Debre Tabor University",
    clientLogo: "/images/customers/debre-tabor-university.png",
    name: "Campus CCTV Design & Implementation",
    sector: "Education",
    year: "2022 – 2024",
    location: "Debre Tabor, Ethiopia",
    summary:
      "Design, supervision and project management of the main campus IP video surveillance system.",
    highlights: ["80 IP cameras", "Main campus coverage"],
    technologies: ["IP video surveillance", "Design", "Supervision"],
    featured: {
      image: { src: "/images/photos/university.jpg", alt: "University campus building" },
    },
  },
  {
    id: "united-beverages-fortigate-renewal",
    group: "integration",
    client: "United Beverages S.C.",
    name: "FortiGate License Renewal",
    sector: "Manufacturing",
    year: "2022",
    location: "Addis Ababa, Ethiopia",
    summary: "License renewal supply for the company's FortiGate firewalls.",
    highlights: ["3 × FortiGate 100E"],
    technologies: ["Fortinet", "Licensing"],
  },
  {
    id: "lion-insurance",
    group: "integration",
    client: "Lion Insurance Company",
    clientLogo: "/images/customers/lion-insurance.png",
    name: "Network Firewall",
    sector: "Insurance",
    year: "2021",
    location: "Addis Ababa, Ethiopia",
    summary: "Supply, installation, configuration and training for a FortiGate network firewall.",
    highlights: ["FortiGate firewall", "Configuration & training"],
    technologies: ["Fortinet", "Next-generation firewall", "Training"],
  },
  {
    id: "dimtsi-weyane",
    group: "integration",
    client: "Dimtsi Weyane Tigray PLC",
    clientLogo: "/images/customers/dimtsi-weyane.png",
    name: "Network Firewall",
    sector: "Media",
    year: "2020",
    location: "Mekelle, Ethiopia",
    summary: "Supply, installation, configuration and training for a FortiGate network firewall.",
    highlights: ["FortiGate firewall", "Configuration & training"],
    technologies: ["Fortinet", "Next-generation firewall", "Training"],
  },
  {
    id: "aa-education-windows-server",
    group: "integration",
    client:
      "Addis Ababa City Government Education and Training Quality Professional Assessment and Assurance Authority",
    name: "Windows Server 2019 Supply & Installation",
    sector: "Government",
    year: "2020",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, installation, configuration and training for Microsoft Windows Server 2019 across the authority's sites.",
    highlights: ["9 sites"],
    technologies: ["Windows Server 2019", "Training"],
  },
  {
    id: "aa-education-routers",
    group: "integration",
    client:
      "Addis Ababa City Government Education and Training Quality Professional Assessment and Assurance Authority",
    name: "Cisco Routers Supply & Training",
    sector: "Government",
    year: "2019 – 2020",
    location: "Addis Ababa, Ethiopia",
    summary: "Supply of Cisco routers with training on installation and configuration.",
    highlights: ["6 Cisco routers"],
    technologies: ["Cisco", "Routing", "Training"],
  },
  {
    id: "allenatech-servers",
    group: "integration",
    client: "Allenatech Electronic Technologies S.C.",
    name: "Dell EMC Data Center Servers",
    sector: "Technology",
    year: "2019",
    location: "Mekelle, Ethiopia",
    summary: "Supply, installation and training for Dell EMC PowerEdge data center servers.",
    highlights: ["4 × Dell EMC PowerEdge R740xd"],
    technologies: ["Dell EMC", "Servers"],
  },

  // ── Software & Cloud Services ────────────────────────────────────────────
  {
    id: "mota-engil",
    group: "cloud",
    client: "Mota-Engil",
    clientLogo: "/images/customers/mota-engil.png",
    name: "Microsoft Windows 11 Pro",
    sector: "Construction",
    year: "2026",
    location: "Ethiopia",
    summary: "Supply of Microsoft Windows 11 Pro, completed within five days.",
    highlights: ["31 users"],
    technologies: ["Windows 11 Pro"],
  },
  {
    id: "yunabek",
    group: "cloud",
    client: "Yunabek Trading PLC",
    name: "Microsoft Exchange Online Email System",
    sector: "Trade",
    year: "2025",
    location: "Ethiopia",
    summary:
      "Supply and integration of Exchange Online Plan 1 — domain integration, user provisioning, policy setting, testing and commissioning.",
    highlights: ["40 users", "Delivered in 5 days"],
    technologies: ["Exchange Online", "Microsoft 365"],
  },
  {
    id: "papda",
    group: "cloud",
    client: "Partnership for Pastoralists Development Association (PAPDA)",
    clientLogo: "/images/customers/papda.png",
    name: "Microsoft 365 Business Premium & Power BI",
    sector: "NGO & Development",
    year: "2025",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, installation, configuration and training for Microsoft 365 and Power BI (NGO editions).",
    highlights: ["18 × Microsoft 365 Business Premium", "Power BI Premium"],
    technologies: ["Microsoft 365", "Power BI"],
  },
  {
    id: "eda",
    group: "cloud",
    client: "Emmanuel Development Association (EDA)",
    clientLogo: "/images/customers/eda.png",
    name: "Microsoft 365 Business Standard",
    sector: "NGO & Development",
    year: "2025",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, installation, configuration and training for Microsoft 365 (non-profit edition).",
    highlights: ["10 users"],
    technologies: ["Microsoft 365"],
  },
  {
    id: "development-for-all",
    group: "cloud",
    client: "Development for All (DfA)",
    clientLogo: "/images/customers/development-for-all.png",
    name: "Microsoft 365 & Cloud QuickBooks",
    sector: "NGO & Development",
    year: "2025",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, installation, configuration and training for Microsoft 365 Business Standard (NGO edition), plus cloud-based QuickBooks.",
    highlights: ["20 × Microsoft 365 Business Standard", "Cloud QuickBooks"],
    technologies: ["Microsoft 365", "QuickBooks Online"],
  },
  {
    id: "united-beverages-m365",
    group: "cloud",
    client: "United Beverages S.C.",
    name: "Microsoft 365, Power BI Pro & Visio",
    sector: "Manufacturing",
    year: "2024 – 2026",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply of Microsoft 365 Business Standard, Power BI Pro and Visio Plan 2, renewed for 2025–2026.",
    highlights: ["166 × Microsoft 365", "13 × Power BI Pro", "Visio Plan 2"],
    technologies: ["Microsoft 365", "Power BI", "Visio"],
  },
  {
    id: "rammis-bank",
    group: "cloud",
    client: "Rammis Bank",
    clientLogo: "/images/customers/rammis-bank.png",
    name: "Microsoft 365 Project",
    sector: "Banking & Financial Services",
    year: "2023",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, installation, configuration and training for Microsoft 365 — email, Teams, OneDrive and Office applications. Delivered twice.",
    highlights: ["2 engagements"],
    technologies: ["Microsoft 365", "Exchange Online", "Teams", "OneDrive"],
  },
  {
    id: "giz-opa",
    group: "cloud",
    client: "GIZ — Oromia Pastoralist Association",
    clientLogo: "/images/customers/giz.png",
    name: "Microsoft 365 Business Standard",
    sector: "NGO & Development",
    year: "2022",
    location: "Addis Ababa, Ethiopia",
    summary:
      "GIZ-sponsored supply, installation, configuration and training for Microsoft 365 — email, Teams, OneDrive and Office applications.",
    highlights: ["12 users"],
    technologies: ["Microsoft 365"],
  },
  {
    id: "aura-trading",
    group: "cloud",
    client: "Aura Trading PLC",
    name: "Microsoft 365 Business Standard",
    sector: "Trade",
    year: "2022",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, installation, configuration and training for Microsoft 365 — email, Teams, OneDrive and Office applications. Delivered twice.",
    highlights: ["2 engagements"],
    technologies: ["Microsoft 365"],
  },
  {
    id: "rrs",
    group: "cloud",
    client: "Refugees and Returnees Service (RRS)",
    clientLogo: "/images/customers/rrs.png",
    name: "Microsoft 365 Implementation",
    sector: "Government",
    year: "2022",
    location: "Addis Ababa, Ethiopia",
    summary:
      "Supply, implementation and training for Microsoft 365 — email, Teams, OneDrive and Office applications. Delivered in three engagements.",
    highlights: ["500 users", "3 engagements"],
    technologies: ["Microsoft 365", "Exchange Online", "Teams"],
  },
  {
    id: "apcfc",
    group: "cloud",
    client: "APCfC",
    name: "Microsoft 365 Supply & Implementation",
    sector: "NGO & Development",
    location: "Ethiopia",
    summary: "Supply, installation, configuration and training for Microsoft 365.",
    highlights: [],
    technologies: ["Microsoft 365"],
  },
];

/** Projects shown with the large editorial card (home showcase and top of the projects page). */
export const featuredProjects = projects.filter(
  (p): p is Project & Required<Pick<Project, "featured">> => Boolean(p.featured),
);

/** Categories used for the projects page hero. */
export const projectCategories = [
  "Data Center Infrastructure",
  "Enterprise Network Infrastructure",
  "Cybersecurity Deployment",
  "Video Surveillance",
  "Cloud & Business Continuity",
] as const;
