/**
 * National and enterprise clients in Ethiopia. Source: Yaron Engineering PLC Company Profile
 * (updated August 2026). Logos are official marks normalised to transparent PNGs in
 * `public/images/customers`; `url` is set only where the organisation's live website was verified.
 */
export type Customer = {
  id: string;
  name: string;
  /** Short label used as a wordmark when no official logo is available. */
  shortName?: string;
  amharicName?: string;
  logo?: string;
  category: string;
  description: string;
  url?: string;
};

export const customers: Customer[] = [
  {
    id: "federal-supreme-court",
    name: "Federal Supreme Court",
    amharicName: "ፌደራል ጠቅላይ ፍርድ ቤት",
    logo: "/images/customers/federal-supreme-court.png",
    category: "Government & Judiciary",
    description:
      "Main and DR data centers, LAN and WAN infrastructure, CCTV and computing and storage consultancy across 24 sites.",
  },
  {
    id: "awash-bank",
    name: "Awash Bank",
    amharicName: "አዋሽ ባንክ",
    logo: "/images/customers/awash-bank.png",
    category: "Banking & Financial Services",
    description:
      "IT governance and security management, enterprise network and security design, and data center, computing and storage consultancy.",
    url: "https://awashbank.com",
  },
  {
    id: "esl",
    name: "Ethiopian Shipping and Logistics Services Enterprise",
    amharicName: "የኢትዮጵያ ባህር ትራንስፖርትና ሎጂስቲክስ",
    logo: "/images/customers/esl.png",
    category: "State Enterprise & Logistics",
    description:
      "Data center, network and security, and HCI computing and storage consultancy — including the data center relocation and migration.",
    url: "https://esl.et",
  },
  {
    id: "ethiopian-airlines",
    name: "Ethiopian Airlines",
    logo: "/images/customers/ethiopian-airlines.png",
    category: "Aviation",
    description: "Jimma Airport network infrastructure, IP CCTV and fire alarm systems.",
    url: "https://www.ethiopianairlines.com",
  },
  {
    id: "aa-culture-tourism",
    name: "Addis Ababa Culture, Art and Tourism Bureau",
    amharicName: "ባህል፣ ሥነ ጥበብ እና ቱሪዝም ቢሮ",
    logo: "/images/customers/aa-culture-tourism.png",
    category: "Government & Public Administration",
    description:
      "HQ network and security design and implementation — network and security, CCTV and digital signage systems.",
    url: "https://discoveraddis.gov.et",
  },
  {
    id: "debre-tabor-university",
    name: "Debre Tabor University",
    amharicName: "ደብረ ታቦር ዩኒቨርሲቲ",
    logo: "/images/customers/debre-tabor-university.png",
    category: "Higher Education & Research",
    description: "Main campus IP video surveillance design, supervision and project management.",
    url: "https://www.dtu.edu.et",
  },
  {
    id: "addis-ababa-city",
    name: "City Government of Addis Ababa — Lideta Sub City",
    logo: "/images/customers/addis-ababa-city.png",
    category: "Government & Public Administration",
    description:
      "Huawei modular data center facility and IP CCTV systems for the sub city HQ building.",
  },
  {
    id: "pehaa",
    name: "Public Enterprises Holding and Administration Agency",
    logo: "/images/customers/pehaa.png",
    category: "Government",
    description:
      "National Data Repository consultancy — application, infrastructure, data center and training.",
  },
  {
    id: "coopbank-oromia",
    name: "Cooperative Bank of Oromia",
    logo: "/images/customers/coopbank-oromia.png",
    category: "Banking & Financial Services",
    description: "Data center facility consultancy and migration to the new data center.",
    url: "https://coopbankoromia.com.et",
  },
  {
    id: "decsi",
    name: "Dedebit Credit and Saving Institution",
    logo: "/images/customers/decsi.png",
    category: "Microfinance",
    description:
      "Data center consultancy, plus HPE servers, storage, VMware virtualization and Microsoft 365 integration.",
  },
  {
    id: "ofag",
    name: "Office of the Federal Auditor General",
    logo: "/images/customers/ofag.png",
    category: "Government",
    description:
      "Testing and commissioning of the data center facility, network and security, computing and storage and WLAN.",
  },
  {
    id: "lion-insurance",
    name: "Lion Insurance Company",
    amharicName: "አንበሳ ኢንሹራንስ ኩባንያ",
    logo: "/images/customers/lion-insurance.png",
    category: "Insurance & Financial Protection",
    description: "FortiGate firewall supply, installation, configuration and training.",
    url: "https://www.anbessainsurance.com",
  },
  {
    id: "rammis-bank",
    name: "Rammis Bank",
    logo: "/images/customers/rammis-bank.png",
    category: "Banking & Financial Services",
    description:
      "Supply, installation, configuration and training for Microsoft 365 — email, Teams, OneDrive and Office.",
    url: "https://www.rammisbank.com",
  },
  {
    id: "vora-addis-hotel",
    name: "Vora Addis Hotel",
    logo: "/images/customers/vora-addis-hotel.png",
    category: "Hospitality",
    description:
      "LAN, Wi-Fi, IP CCTV, IP telephony, IPTV and door-lock and elevator access control systems.",
    url: "https://voraaddishotel.com",
  },
  {
    id: "rrs",
    name: "Refugees and Returnees Service",
    logo: "/images/customers/rrs.png",
    category: "Government",
    description: "Microsoft 365 supply, implementation and training for 500 users.",
    url: "https://rrs.et",
  },
  {
    id: "mota-engil",
    name: "Mota-Engil",
    logo: "/images/customers/mota-engil.png",
    category: "Construction",
    description: "Microsoft Windows 11 Pro supply.",
    url: "https://www.mota-engil.com",
  },
  {
    id: "giz",
    name: "GIZ — Oromia Pastoralist Association",
    logo: "/images/customers/giz.png",
    category: "International Development",
    description: "GIZ-sponsored Microsoft 365 supply, installation, configuration and training.",
    url: "https://www.giz.de/en",
  },
  {
    id: "dimtsi-weyane",
    name: "Dimtsi Weyane Tigray",
    logo: "/images/customers/dimtsi-weyane.png",
    category: "Media",
    description: "FortiGate network firewall supply, installation, configuration and training.",
  },
  {
    id: "eda",
    name: "Emmanuel Development Association",
    logo: "/images/customers/eda.png",
    category: "NGO & Development",
    description: "Microsoft 365 Business Standard supply, configuration and training.",
    url: "https://edaethiopia.org",
  },
  {
    id: "papda",
    name: "Partnership for Pastoralists Development Association",
    logo: "/images/customers/papda.png",
    category: "NGO & Development",
    description: "Microsoft 365 Business Premium and Power BI supply, configuration and training.",
    url: "https://papdaa.org",
  },
  {
    id: "development-for-all",
    name: "Development for All",
    logo: "/images/customers/development-for-all.png",
    category: "NGO & Development",
    description: "Microsoft 365 Business Standard and cloud-based QuickBooks.",
  },
  {
    id: "interdist",
    name: "Interdist Alliances",
    logo: "/images/customers/interdist.png",
    category: "Technology Distribution",
    description:
      "Ethiopia sales office management for Cisco, Oracle, NetApp and IBM product distribution.",
  },
  {
    id: "united-beverages",
    name: "United Beverages S.C.",
    shortName: "United Beverages",
    category: "Manufacturing",
    description: "FortiGate firewalls and license renewal, Microsoft 365, Power BI Pro and Visio.",
  },
  {
    id: "fana-sacco",
    name: "Fana Youth Saving and Credit Cooperative",
    shortName: "Fana SACCO",
    category: "Microfinance",
    description:
      "Micro data center, Cisco networking, Lenovo servers with KVM virtualization and firewalls.",
  },
];
